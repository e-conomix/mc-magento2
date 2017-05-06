/**
 * Ebizmarts_MailChimp Magento JS component
 *
 * @category    Ebizmarts
 * @package     Ebizmarts_MailChimp
 * @author      Ebizmarts Team <info@ebizmarts.com>
 * @copyright   Ebizmarts (http://ebizmarts.com)
 * @license     http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */
define([
        'jquery'
],
    function($){
        "use strict";

        $.widget('mage.configmonkeyapikey', {
            "options": {
              "storeUrl": "",
              "detailsUrl": ""
            },

            _init: function () {
                var self = this;
                $('#mailchimp_general_apikey').change(function() {
                    var apiKey = $('#mailchimp_general_apikey').find(':selected').val();
                    self._loadStores(apiKey);
                });
                $('#mailchimp_general_apikeylist').change(function() {
                    var oldApiKey = $('#mailchimp_general_apikey').find(':selected').val();
                    self._loadApiKeys(oldApiKey);
                });
                $('#mailchimp_general_monkeystore').change(function() {
                    self._loadDetails();
                });
            },

            _loadStores: function (apiKey) {
                var storeUrl = this.options.storeUrl;
                // remove all items in list combo
                $('#mailchimp_general_monkeystore').empty();
                // get the selected apikey
                $('#mailchimp_general_monkeystore').append($('<option>', {
                    value: -1,
                    text : 'Select one Mailchimp Store'
                }));
                // get the list for this apikey via ajax
                $.ajax({
                        url: storeUrl,
                        data: {'form_key':  window.FORM_KEY, 'apikey': apiKey},
                        type: 'POST',
                        dataType: 'json',
                        showLoader: true
                    }
                ).done(function(data) {
                    var unique = data.length;
                    $.each(data, function (i, item) {
                        if(unique == 1) {
                            $('#mailchimp_general_monkeystore').append($('<option>', {
                                value: item.id,
                                text: item.name,
                                selected: "selected"
                            }));
                        }
                        else {
                            $('#mailchimp_general_monkeystore').append($('<option>', {
                                value: item.id,
                                text: item.name
                            }));
                        }
                    });
                });
                this._loadDetails();
            },
            _loadApiKeys: function(oldApiKey) {
                $('#mailchimp_general_apikey').empty();

                $('#mailchimp_general_apikey').append($('<option>', {
                    value: -1,
                    text: 'Select one ApiKey'
                }));
                var apikeys = $('#mailchimp_general_apikeylist').val();
                var lines = apikeys.split(/\n/);
                var unique = 0;
                var newApiKey = 0;
                if(lines.length == 1) {
                    unique = 1;
                }
                $.each(lines, function (i, item) {
                    if (lines[i] == oldApiKey || unique) {
                        $('#mailchimp_general_apikey').append($('<option>', {
                            value: lines[i],
                            text: lines[i],
                            selected: "selected"
                        }));
                        newApiKey = lines[i];
                    } else {
                        $('#mailchimp_general_apikey').append($('<option>', {
                            value: lines[i],
                            text: lines[i]
                        }));
                    }
                } );
                if(newApiKey!=oldApiKey) {
                    this._loadStores(newApiKey);
                }

            },
            _loadDetails: function() {
                var detailsUrl = this.options.detailsUrl;
                var selectedApiKey = $('#mailchimp_general_apikey').find(':selected').val();
                var selectedStore = $('#mailchimp_general_monkeystore').find(':selected').val();
                $('#mailchimp_general_account_details_ul').empty();
                $.ajax({
                        url: detailsUrl,
                        data: {'form_key':  window.FORM_KEY, 'apikey': selectedApiKey, "store": selectedStore},
                        type: 'POST',
                        dataType: 'json',
                        showLoader: true
                    }
                ).done(function(data) {
                    $.each(data, function (i,item) {
                        $('#mailchimp_general_account_details_ul').append('<li>'+item.label+' '+item.value+'</li>');
                    });
                });

            }

        });
        return $.mage.configmonkeyapikey;
    });