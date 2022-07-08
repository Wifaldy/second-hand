// example pict
// https://res.cloudinary.com/second-hand6-bejs/image/upload/v1657292503/product/m63a9fudzroclomsnli3.jpg

const deletePict = async (imgUrl) => {
    const splitURL = imgUrl.split('/')
    console.log(splitURL);
    const imageId = splitURL[splitURL.length - 1].slice(0, splitURL[splitURL.length - 1].length - 4)
    console.log(imageId);
    
  }

  deletePict("https://res.cloudinary.com/second-hand6-bejs/image/upload/v1657292503/product/m63a9fudzroclomsnli3.jpg")