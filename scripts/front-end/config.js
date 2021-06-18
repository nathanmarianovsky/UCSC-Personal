require.config({
    baseUrl: "",
    paths: {
        app: "/scripts/front-end",
        lib: "/node_modules",
        jquery: "/node_modules/jquery/dist/jquery.min",
        materialize: "/bower_components/materializecss-amd/dist/materialize.amd.min",
        router5: "/node_modules/router5/dist/amd/router5.min",
        mathjax: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?...",
        math: "/node_modules/mathjs/lib/browser/math"
    },
    shim: {
        materialize: {
            exports: "Materialize",
            deps: ["jquery"]
        },
        mathjax: {
            exports: "MathJax",
            init: function () {
                MathJax.Hub.Config({
                    tex2jax: {inlineMath: [["$","$"], ["\\(","\\)"]]}
                });
                MathJax.Hub.Startup.onload();
                return MathJax;
            }
        }
    }
});

require(["app/main"]);