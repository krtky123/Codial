module.exports.home = function(req,res){
    // console.log(req.cookies);
    // res.end('<h1>Falak</h1>');
    // console.log(req);
    // res.cookie('user_id',25);
    return res.render('home',{
        title : "home",
    });
}