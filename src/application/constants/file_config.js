const image_exs = [
    'gif',
    'jpg',
    'jpeg',
    'jpe',
    'jfif',
    'png',
    'bmp',
    'dib',
    'rle',
    'ico',
    'ai',
    'art',
    'cam',
    'cdr',
    'cgm',
    'cmp',
    'dpx',
    'fal',
    'q0',
    'fpx',
    'j6i',
    'mac',
    'mag',
    'maki',
    'mng',
    'pcd',
    'pct',
    'pic',
    'pict',
    'pcx',
    'pmp',
    'pnm',
    'psd',
    'ras',
    'sj1',
    'tif',
    'tiff',
    'nsk',
    'tga',
    'wmf',
    'wpg',
    'xbm',
    'xpm',
];

const isImage = src => image_exs.includes(src);

module.exports = {
    isImage,
    image_exs,
};