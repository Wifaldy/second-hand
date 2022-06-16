var ProductSingleton = (function() {
    class ProductPreview {
        constructor() {
            this.dataPreview = null;
        }

        set setData(data) {
            this.dataPreview = data;
        }
        resetData() {
            this.dataPreview = null;
        }
        get getData() {
            return this.dataPreview;
        }
    }

    var instance;
    return {
        getInstance: function() {
            if (instance == null) {
                instance = new ProductPreview();
                // Hide the constructor so the returned object can't be new'd...
                instance.constructor = null;
            }
            return instance;
        },
    };
})();

module.exports = ProductSingleton;