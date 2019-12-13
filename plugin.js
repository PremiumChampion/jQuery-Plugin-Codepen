(function ($) {
    $.fn.codepen = $.fn.codepen || function () {
        var instance = {
            properties: {
                htmlEle: "textarea:eq(0)",
                jsEle: "textarea:eq(2)",
                cssEle: "textarea:eq(1)",
                frameEle: "iframe:eq(0)",
                testValues: "false",
                autoRefresh: "true",
                createRefresh: "true",
                testvaluehtml: "<button onclick='test()'>Test me</button>",
                testvaluejs: "function test(){ alert('this is a test');}",
                testvaluecss: "button { text-align: center; color: blue; font-size: xx-large; font-family: Arial; padding: 3.5%; }",
                attriframe: { height: "200px", width: "100%;", frameborder: "0", style: "background-color: black;" },
                class: "",
                styletextarea: "true"
            },

            values: {
                html: "false",
                js: "false",
                css: "false"
            },

            functions: {

                setAttributes: function () {
                    if ($(this).is("form") && instance.properties.autoRefresh === "false" && instance.properties.createRefresh === "true") {
                        if ($(this).has("button[type=submit]") || $(this).has("input[type=button][value=submit]")) {
                            $(this).append("<button type='submit'>Aktualisieren</button>");
                        }
                    }

                    $.extend(instance.properties.attriframe, { sandbox: "allow-forms allow-same-origin allow-modals allow-popups allow-scripts" });

                    $(this).find(instance.properties.frameEle).attr(instance.properties.attriframe);
                    $(this).find(instance.properties.htmlEle).attr({ tabindex: "-1" });
                    $(this).find(instance.properties.jsEle).attr({ tabindex: "-1" });
                    $(this).find(instance.properties.cssEle).attr({ tabindex: "-1" });
                    $(this).addClass(instance.properties.class);

                    if (instance.properties.styletextarea === "true") {

                        var textareastyling = {
                            backgroundColor: "black",
                            color: "white",
                            width: "32.7%",
                            height: "250px"
                        };

                        $(this).find(instance.properties.htmlEle).css(textareastyling);
                        $(this).find(instance.properties.cssEle).css(textareastyling);
                        $(this).find(instance.properties.jsEle).css(textareastyling);
                        
                    }
                },

                refreshHTML: function () {
                    var htmlcontent = $(this).val();
                    $(this).parent().find(instance.properties.frameEle).contents().find("body").html(htmlcontent);

                    if (htmlcontent === "") {
                        instance.values.html = "false";
                        $(this).parent().find(instance.properties.frameEle).css({ backgroundColor: "black" });

                    } else {
                        instance.values.html = "true";
                        $(this).parent().find(instance.properties.frameEle).css({ backgroundColor: "white" });
                    }

                },

                refreshCSS: function () {
                    var csscontent = $(this).val();
                    $(this).parent().find(instance.properties.frameEle).contents().find("head:eq(0)").html("<style>" + csscontent + "</style");

                    if (csscontent === "") {
                        instance.values.css = "false";
                        if (instance.values.html === "false" && instance.values.js === "false") {
                            $(this).parent().find(instance.properties.frameEle).css({ backgroundColor: "black" });
                        }
                    } else {
                        instance.values.css = "true";
                        $(this).parent().find(instance.properties.frameEle).css({ backgroundColor: "white" });
                    }
                },

                refreshJS: function () {
                    var code = "window.onerror = function(message, source, lineno) { alert(\"ooops, something went wrong!\\n\" + message + \"\\n@ Line: \" + lineno);}\n " + $(this).val();
                    $(this).parent().find(instance.properties.frameEle).get(0).contentWindow.eval(code);

                    if ($(this).val() === "") {
                        instance.values.js = "false";
                        if (instance.values.css === "false" && instance.values.html === "false") {
                            $(this).parent().find(instance.properties.frameEle).css({ backgroundColor: "black" });
                        }
                    } else {
                        instance.values.js = "true";
                        $(this).parent().find(instance.properties.frameEle).css({ backgroundColor: "white" });
                    }
                },

                testValues: function () {
                    this.find(instance.properties.htmlEle).val(instance.properties.testvaluehtml).trigger("change");
                    this.find(instance.properties.jsEle).val(instance.properties.testvaluejs).trigger("change");
                    this.find(instance.properties.cssEle).val(instance.properties.testvaluecss).trigger("change");
                },

            },

            events: {
                OnDocumentReady: function () {
                    if (instance.properties.autoRefresh === "true") {

                        this.find(instance.properties.htmlEle).change(function () {
                            instance.functions.refreshHTML.apply(this);

                        });

                        this.find(instance.properties.cssEle).change(function () {
                            instance.functions.refreshCSS.apply(this);

                        });

                        this.find(instance.properties.jsEle).change(function () {
                            instance.functions.refreshJS.apply(this);

                        });

                        this.find(instance.properties.htmlEle).change();
                        this.find(instance.properties.cssEle).change();
                        this.find(instance.properties.jsEle).change();

                    } else {

                        $(this).submit(function (event) {
                            instance.functions.refreshHTML.apply($(this).find(instance.properties.htmlEle));
                            instance.functions.refreshCSS.apply($(this).find(instance.properties.cssEle));
                            instance.functions.refreshJS.apply($(this).find(instance.properties.jsEle));
                            event.preventDefault();
                        });
                    }
                }
            },

            init: function (args) {
                $.extend(instance.properties, args);
                instance.functions.setAttributes.apply(this);
                if (instance.properties.testValues === "true") { instance.functions.testValues.apply(this) }

                $(document).ready(instance.events.OnDocumentReady.bind(this));

                return instance;
            }
        }

        return instance.init.apply(this, arguments);
    };
})(jQuery);