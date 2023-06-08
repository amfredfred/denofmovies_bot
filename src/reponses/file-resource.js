

const fileResource = (post) => ({
    fileId: post?.file_id,
    fileType: post?.file_type,
    fileContent: post?.file_content,
    fileSize: post?.file_size,
    fileUploader: post?.file_uploader,
    fileUploadedFrom: post?.file_uploaded_from,
    fileDownloadCount: post?.file_download_count,
    fileRelativePath: post?.file_relative_path,
    filePlaceHolder: post?.file_place_holder,
    fileOriginalSize: post?.file_original_size,
    fileParentPath: post?.file_parent_path,
    fileDescription: post?.file_description,
    fileThumbnails: post?.file_thumbnails,
    fileCreatedAt: post?.updated_at
})


const filesCollection = (posts = []) => posts?.map(post => fileResource(post))
module.exports = { filesCollection, fileResource }
