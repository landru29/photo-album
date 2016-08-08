angular.module("application").service("resourcePhoto", function ($resource, CONFIG, linksInterceptor) {
    return $resource(
        [CONFIG.api.baseUrl, "pics"].join("/"),
        {}, {
            query: {
                method: "GET",
                interceptor: linksInterceptor,
                isArray: true,
                /*transformResponse: function(data, headers){
                    response = {}
                    response.data = data;
                    response.headers = headers();
                    console.log(response.headers);
                    return response;
                }*/
            }
        }
    );
});
