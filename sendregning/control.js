/*jshint strict: true, undef: true, unused: true */
/*global document, $, SendRegning, UIManager */

/*
 * Created by: Lachlan Hunt
 * Date:       2013-04-28
 * Depends on: JQuery
 *
 * Very simple and limited implementation of the SendRegning web service API.
 * Supports obtaining lists of recipients, the balance and invoices associated with a specified recipient
 */

(function() {
    "use strict";

    var ui = null;
    var sws = null;
    var recipients = null;
    var perPage = 5;

    /* Login Processes */
    function login() {
        // Create a new SendRegning Web Service manager and login
        sws = new SendRegning($("#email")[0].value, $("#password")[0].value, loginSuccess, loginError);
    }

    function loginSuccess() {
        ui.loginSuccess();

        sws.selectRecipients(function success(data) {
            recipients = data.recipients.recipient;
            ui.renderRecipientList(recipients.slice(0, 5));
            ui.renderPagination(recipients.length, 5);
        });

    }

    function loginError () {
        ui.loginError("Incorrect username or password. Please try again.");
    }


    /* Account Actions */

    function loadProfile(evt) {
        var recipientNo = evt.target.dataset.recipientno;
        sws.selectRecipientByNumber(recipientNo, function(recipientData) {
            sws.selectBalance(recipientNo, function(balanceData) {
                ui.renderRecipientProfile(recipientData.recipients.recipient, balanceData.balance.recipients.recipient.balance);
            });
        });
    }

    function loadInvoices(evt) {
        var recipientNo = evt.target.dataset.recipientno;
        sws.selectInvoices(recipientNo, function success(invoiceData) {
            if (invoiceData === undefined) {
                ui.renderInvoiceList([]);
            } else if (Array.isArray(invoiceData.invoices.invoice)) {
                ui.renderInvoiceList(invoiceData.invoices.invoice);
            } else {
                ui.renderInvoiceList([invoiceData.invoices.invoice]);
            }
        });
    }

    function loadPage(evt) {
        var from = evt.target.dataset.from;
        ui.closeRecipientProfile();
        ui.renderRecipientList(recipients.slice(from, from + perPage));
    }

    $(document).ready(function() {
        ui = new UIManager(document);

        $("#login input[type=button]").click(login);

        $("#recipients tbody").delegate(".name>a", "click", loadProfile);
        $("#pagination").delegate("a", "click", loadPage);

        $("#close").click(function close () {
            ui.closeRecipientProfile();
        });

        $("#show-invoices").click(loadInvoices);
    });
})();
