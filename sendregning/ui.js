/*jshint strict: true, undef: true, unused: true */
/*global $ */

/*
 * Created by: Lachlan Hunt
 * Date:       2013-04-28
 * Depends on: JQuery
 *
 * User Interface manager
 */

(function(global) {
    "use strict";
    // Shared state and internal functions
    var recipientTemplate = null;
    var invoiceTemplate = null;

    // Constructor
    function UIManager(document) {
        // Associate this UI manager with an explicit document, rather than assume it's the same as the
        // document that this script is running in. In theory, this would allow the controller to be
        // running in a different document from where the UI is rendered (e.g. in an iframe).
        Object.defineProperty(this, "document", {
            "value": $(document)
        });

        recipientTemplate = this.document.find("#recipients tbody tr");
        recipientTemplate.detach();
        invoiceTemplate = this.document.find("#invoices tbody tr");
        invoiceTemplate.detach();
    }

    UIManager.prototype.loginSuccess = function loginSuccess() {
        this.document.find("#login").attr("hidden", "")
            .find("+#recipients").removeAttr("hidden");
    };

    UIManager.prototype.loginError = function loginError(message) {
        this.document.find("#login").addClass("error").find(".status").text(message || "Login error");
    };

    UIManager.prototype.renderRecipientList = function renderRecipientList(recipients) {
        var table = this.document.find("#recipients table");

        var rows = recipients.map(function(value) {
            var tr = recipientTemplate.clone();

            // Escape any '<' to prevent anything from being interpreted as HTML elements
            // This should also eliminate risk of any scripts being executed
            tr.find(".name a").html(value.name.replace('<', '&lt;'))
                              .attr("href", "#" + value.optional.recipientNo)
                              .attr("data-recipientno", value.optional.recipientNo);
            tr.find(".address").html(value.optional.address1.replace('<', '&lt;'));
            tr.find(".email a").html(value.optional.email.replace('<', '&lt;'))
                              .attr("href", "mailto:" + value.optional.email);

            return tr;
        });
        table.find("tbody").empty().append(rows);

    };

    UIManager.prototype.renderPagination = function(length, perPage) {
        var ul = this.document.find("#pagination");
        for (var i = 0; i < length; i += perPage) {
            var from = i + 1,
                to = i + perPage > length ? length : i + perPage;

            var a = $("<a>").attr("href", "#from" + from + "to" + to)
                    .attr("data-from", i)
                    .text(from + " to " + to);

            ul.append($("<li>").append(a));
        }
    }

    UIManager.prototype.renderRecipientProfile = function renderRecipientProfile(recipient, balance) {
        this.hideInvoiceList();

        var profile = this.document.find("#profile");

        profile.find("#name").html(recipient.name.replace('<', '&lt;'));
        profile.find("#address .address1").html(recipient.optional.address1.replace('<', '&lt;'));
        profile.find("#address .address2").html(recipient.optional.address2.replace('<', '&lt;'));
        profile.find("#address .zip").html(recipient.zip.replace('<', '&lt;'));
        profile.find("#address .city").html(recipient.city.replace('<', '&lt;'));
        profile.find("#address .country").html(recipient.optional.country.replace('<', '&lt;'));

        profile.find("#balance span").html(balance.replace('<', '&lt;'));

        profile.find("#show-invoices")
               .attr("data-recipientno", recipient.optional.recipientNo)
               .attr("href", "#" + recipient.optional.recipientNo);


        profile.removeAttr("hidden");
    };

    UIManager.prototype.closeRecipientProfile = function closeRecipientProfile() {
        this.document.find("#profile").attr("hidden", "");
        this.hideInvoiceList();
    };

    UIManager.prototype.renderInvoiceList = function renderInvoiceList(invoices) {
        var table = this.document.find("#invoices table");

        var rows = invoices.map(function(value) {
            var tr = invoiceTemplate.clone();

            // Escape any '<' to prevent anything from being interpreted as HTML elements
            // This should also eliminate risk of any scripts being executed
            tr.find(".invoiceNo").html(value.optional.invoiceNo.replace('<', '&lt;'));
            tr.find(".invoiceDate").html(value.optional.invoiceDate.replace('<', '&lt;'));
            tr.find(".dueDate").html(value.optional.dueDate.replace('<', '&lt;'));
            tr.find(".total").html(value.optional.total.replace('<', '&lt;'));
            tr.find(".state").html(value.optional.state.replace('<', '&lt;'));
            return tr;
        });
        this.document.find("#show-invoices").attr("hidden", "");
        table.removeAttr("hidden").find("tbody").empty().append(rows);

    };

    UIManager.prototype.hideInvoiceList = function hideInvoiceList() {
        this.document.find("#invoices table").attr("hidden", "")
                        .find("tbody").empty();
        this.document.find("#show-invoices").removeAttr("hidden");
    };

    global.UIManager = UIManager;
})(this);
