angular.module("application").factory("linksInterceptor", function () {
    return {
        response: function (response) {
            var link = {};
            _.forEach(response.headers("link").split(","), function (elt) {
                var matcher = elt.match(/<([^>]*)>;\s*rel="([^"]*)"/);
                if (matcher) {
                    link[matcher[2]] = matcher[1];
                }
            });
            return {
                values: response.resource,
                links: link
            };
        }
    };
});
