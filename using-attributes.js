module.exports = {
  checkPermissions(AccessControl, app, objs) {

    const ac = new AccessControl();
    ac.grant('reader')
        .readAny('posts', ['id', 'title', 'content', 'author'])
      .grant('writer')
        .extend('reader')
        .createOwn('posts')             
        .deleteOwn('posts')
      .grant('editor')                   
        .extend('writer')                 
        .updateAny('posts')  
        .deleteAny('posts');

    ac.grant('reader')
        .readAny('users', ['name','email'])
        .readOwn('users', ['*'])
        .updateOwn('users', ['*', '!id', '!email'])
      .grant('writer')
        .extend('reader')
        .createOwn('users')
        .deleteOwn('users')
      .grant('editor')                   
        .extend('writer')                 
        .updateAny('users');


    app.get('/posts/:title', function (req, res, next) {

      console.log('')
      console.log('')
      console.log(`================================== PERMISSION CONTROL USING ATTRIBUTES =================================`)
      
      console.log(`post ${req.params.title}`)

      const entities = req.headers.entities;

      operations = ['readAny','createAny','updateAny','deleteAny','readOwn','createOwn','updateOwn','deleteOwn']
      operations.forEach((operation)=>{
        permission = ac.can(req.headers.role)[operation](entities);
        if (permission.granted) {
          console.log(`permission is granted to ${req.headers.role} for ${operation} ${entities}`);
          console.log('attributes:',permission.attributes)
          objs[entities].forEach(obj => {
            if(permission.attributes.includes('*')) {
              const excludedAttributes = permission.attributes.filter(a => a[0]=='!').map(a => a.substring(1, a.length));
              Object.keys(obj).forEach(key => {
                if(!excludedAttributes.includes(key)) {
                  console.log('\t',key,'\t',obj[key])
                }
              });
            } else {
              permission.attributes.forEach(attribute => {
                console.log('\t',attribute,'\t',obj[attribute])
              })
            }
          })
        } else {
          fault(`permission is denied to ${req.headers.role} for ${operation} ${entities}`);
        }
      })

      console.log(`================================== PERMISSION CONTROL USING ATTRIBUTES =================================`)
      console.log('')
      console.log('')
      res.send("permissions");
    });
  }
}