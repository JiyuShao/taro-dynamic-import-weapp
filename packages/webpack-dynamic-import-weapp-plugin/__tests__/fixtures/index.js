export default () => {
  import('./dynamic-import/async-add').then(currentModule => {
    console.log(currentModule(1, 2));
  });
};
