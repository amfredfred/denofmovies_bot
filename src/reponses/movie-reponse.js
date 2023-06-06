const moviewResource = (post) => ({
    title: post?.title,
    series: post?.series,
    uploadDate: post?.updatedAt,
    downloads: post?.downloads,
    thumbPath: post?.thumbPath,
    uploader: post?.uploader,
    dateOfRelease: post?.dateOfRelease,
    pathName: post?.pathName,
    genre: post?.genre,
    season: post?.season,
    episode: post?.episode
})


const movieCollection = (posts = []) => posts?.map(post => moviewResource(post))
module.exports = { movieCollection, moviewResource }