var ProductSingleton = (function () {
  class ProductPreview {
    constructor() {
      this.dataPreview = [];
    }

    set setData(data) {
      this.dataPreview.push(data);
    }
    resetData(id) {
      this.dataPreview.splice(
        this.dataPreview.findIndex((data) => {
          return data.user_id === id;
        }),
        1
      );
    }
    getData(id) {
      return this.dataPreview.filter((data) => data.user_id === id)[0];
    }
  }

  var instance;
  return {
    getInstance: function () {
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
