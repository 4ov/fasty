export default class Middleware{
    constructor(req, res){
      this.req = req
      this.res = res
    }
    use(fn){
      var self = this;
  
      this.go = (function(stack) {
        return function(next) {
          stack.call(self, function() {
            fn.call(self, self.req, self.res, next.bind(self));
          });
        }.bind(this);
      })(this.go);
    }
  
    go(next) {
      next();
    };
  }
  
  