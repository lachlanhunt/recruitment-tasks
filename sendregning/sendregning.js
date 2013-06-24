/*jshint strict: true, undef: true, unused: true */
/*global document, $, XMLSerializer, FormData, Blob */

/*
 * Created by: Lachlan Hunt
 * Date:       2013-04-28
 * Depends on: JQuery
 *
 * Very simple and limited implementation of the SendRegning web service API.
 * Supports obtaining lists of recipients, the balance and invoices associated with a specified recipient
 */

(function(global) {
    "use strict";

    $.ajaxSetup({
        "dataType": "json",
        "accepts": {
            "json": "application/json"
        }
    });

    // Shared state and internal functions

    // Web service base URL
    var wsurl = "https://www.sendregning.no/ws/butler.do";
    var serializer = new XMLSerializer();

    // Constructor
    function SendRegning(username, password, successCallback, errorCallback) {
        // This needs to be called as a constructor
        if (!(this instanceof SendRegning)) {
            return new SendRegning(username, password);
        }

        // Prevent these being changed after construction
        // Note: Although this implementation keeps the username and password associated with each instance,
        // it is not possible to use multiple instances simultaneously with different usernames and passwords.
        // This is a limitation of the way XMLHttpRequest works with HTTP 401 authentication.
        Object.defineProperties(this, {
            "username": { value: username, writable: false, enumerable: true },
            "password": { value: password, writable: false, enumerable: true }
        });

        // Attempt to login
        getQuery.call(this, {
            "action": "select",
            "type":   "constant"
        }, successCallback, errorCallback);
    }

    // Utility Functions
    function getQuery(params, successCallback, errorCallback) {
        /*jshint validthis:true */
        $.ajax(wsurl, {
            "data": params,
            "username": this.username,
            "password": this.password
        }).done(successCallback)
          .fail(errorCallback);
    }

    function postQuery(params, data, successCallback, errorCallback) {
        /*jshint validthis:true */
        $.ajax(wsurl + '?' + $.param(params), {
            type: "POST",
            "data": data,
            "processData": false,
            "contentType": false,
            "username": this.username,
            "password": this.password
        }).done(successCallback)
          .fail(errorCallback);
    }

    // Instance Methods
    SendRegning.prototype.selectRecipients = function selectRecipients(successCallback, errorCallback) {
        getQuery.call(this, {
            "action": "select",
            "type":   "recipient"
        }, successCallback, errorCallback);
    };

    SendRegning.prototype.selectRecipientByNumber = function selectRecipientByNumber(recipientNo, successCallback, errorCallback) {
        getQuery.call(this, {
            "action": "select",
            "type":   "recipient",
            "recipientNo": recipientNo
        }, successCallback, errorCallback);
    };


    SendRegning.prototype.selectBalance = function selectBalance(recipientNo, successCallback, errorCallback) {
        getQuery.call(this, {
            "action": "select",
            "type":   "balance",
            "recipientNo": recipientNo
        }, successCallback, errorCallback);
    };

    SendRegning.prototype.selectInvoices = function selectInvoices(recipientNo, successCallback, errorCallback) {
        // Note: The web service allows querying invoices for multiple <recipientNo> elements, but this
        // implmentation only allows one recipient for simplicity.

        // Create the XML document for the query
        var doc = document.implementation.createDocument(null, null, null);
        doc.appendChild(doc.createElement("select"))
           .appendChild(doc.createTextNode("ALL"))
           .parentNode.appendChild(doc.createElement("where"))
           .appendChild(doc.createElement("recipientNumbers"))
           .appendChild(doc.createElement("recipientNumber"))
            // Using textContent ensures that the value of recipientNo is properly sanitised,
            // avoiding potential well-formedness errors.
           .textContent = recipientNo;

        // Serialise the document and store as a blob, then create a FormData object from it
        var data = new FormData();
        data.append("xml", new Blob([serializer.serializeToString(doc)], {type: "text\/xml;charset=UTF-8"}));

        // Post new FormData along with the query
        postQuery.call(this, {
            "action": "select",
            "type":   "invoice"
        }, data, successCallback, errorCallback);
    };

    global.SendRegning = SendRegning;
})(this);
