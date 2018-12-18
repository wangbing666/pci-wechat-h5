'use strict';

var requestTool = require('../common/request-tool');

module.exports = {

  getTest: (req, res) => {
    // requestTool.get(res, 'test', req.query, (data) => {
    //   console.log(data);
      res.render('test/test', {
        name: 'Cajfkd'
      });
    // })
  },

  // postTest: (req, res) => {
  //   requestTool.post(res, 'edit', { id: 6, name: '321' }, (data) => {
  //     console.log(data);
  //     res.render('test/test');
  //   })
  // }

}
