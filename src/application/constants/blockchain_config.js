const mode = {
    PRIVATE_NET: 0,
    INFRA: 1,
};

const current_mode =
    process.env.NODE_ENV == 'development' ? mode.INFRA : mode.PRIVATE_NET;

const mainnnet_mode = mode.INFRA;

module.exports = {
    mode,
    current_mode,
    mainnnet_mode,
};
