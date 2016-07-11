const path = require('path');

const config = new Map();
config.set('path_project', path.resolve(__dirname, '../'));
config.set('dir_src',  'app');
config.set('dir_dist', 'dist');
config.set('dir_dist_production', 'dist_production');

// ------------------------------------
// Utilities
// ------------------------------------
const paths = (() => {
    const base    = [config.get('path_project')];
    const resolve = path.resolve;

    const project = (...args) => resolve.apply(resolve, [...base, ...args]);

    return {
        project : project,
        src     : project.bind(null, config.get('dir_src')),
        dist    : project.bind(null, config.get('dir_dist'))
    };
})();

config.set('utils_paths', paths);
config.set('utils_aliases', [
    'components',
    'utils'
].reduce((acc, dir) => {
    const src = paths.src(dir);
    return (acc[path.basename(src)] = src) && acc;
}, {}));

module.exports = config;