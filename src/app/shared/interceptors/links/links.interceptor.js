angular.module("application").factory("linksInterceptor", function () {
    return {
        response: function (response) {
            var links = {};
            _.forEach(response.headers("link").split(","), function (elt) {
                var matcher = elt.match(/<([^>]*)>;\s*rel="([^"]*)"/);
                if (matcher) {
                    links[matcher[2]] = matcher[1];
                }
            });
            return {
                values: response.resource,
                links: links,
                TotalCount: response.headers("X-Total-Count")
            };
        }
    };
});
