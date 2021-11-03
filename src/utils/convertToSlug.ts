/**
 * convertToSlug dùng để convert 1 string có dấu thành 1 url
 * @params name string để convert qua url
 */
export const convertToSlug = (name: string): string => {
  if (name) {
    // Chuyển hết sang chữ thường
    name = name.toLowerCase();

    // xóa dấu
    name = name.replace(/(-)/g, "");
    name = name.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, "a");
    name = name.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, "e");
    name = name.replace(/(ì|í|ị|ỉ|ĩ)/g, "i");
    name = name.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, "o");
    name = name.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, "u");
    name = name.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, "y");
    name = name.replace(/(đ)/g, "d");

    // Xóa ký tự đặc biệt
    name = name.replace(/([^0-9a-z-\s])/g, "");

    // Xóa khoảng trắng thay bằng ký tự -
    name = name.replace(/(\s+)/g, "-");

    // xóa phần dự - ở đầu
    name = name.replace(/^-+/g, "");

    // xóa phần dư - ở cuối
    name = name.replace(/-+$/g, "");

    // return
    return name;
  }
  return "";
};
