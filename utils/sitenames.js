import modules from '../modules';

export default modules.map((mod) => {
    const { moduleName } = mod;
    return moduleName;
}, {});