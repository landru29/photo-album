angular.module("application").config(function ($translateProvider) {
        "use strict";
        $translateProvider.useCookieStorage();

        $translateProvider.useSanitizeValueStrategy("sanitize");

        // set default and fallback languages
        $translateProvider.preferredLanguage("fr");
        //$windowProvider.$get().moment.locale("fr");

        // define translation loader
        $translateProvider.useLoader("$translatePartialLoader", {
            urlTemplate: function (part, lang) {
                return "assets/" + part + "/translations/" + lang.replace(/_.*$/, "") + ".json";
            }
        });
    })
    .run(function ($rootScope, $translatePartialLoader, $translate, $state) {
        "use strict";

        var lang = navigator.language || navigator.userLanguage;

        if (["en", "fr"].indexOf(lang) > -1) {
            $translate.use(lang);
        } else {
            $translate.use("en");
        }

        // manage route change
        $translate.refresh();
        $rootScope.$on("$stateChangeStart", function (event, routeOption) {
            $translatePartialLoader.addPart("common");
            if (routeOption.translations) {
                angular.forEach(routeOption.translations, function (part) {
                    $translatePartialLoader.addPart(part);
                });
                $translate.refresh();
            }
        });
    });
