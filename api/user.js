var pool = require('../db/pool');
var express = require('express');
var router = express.Router();
//当前专业课程
router.post("/all/kc",(req,res)=>{
     pool.conn({
          sql:"select * from subjects",
          success(data){
               res.send(data);
          },
          error(err){
               res.send(err)
          }
     })
})
//获取反馈信息
router.post("/all/lookfuck", (req, res) => {
     var json = req.body.uid;
     pool.conn({
          sql: "select * from fk where uid=?",
          arr: [parseInt(json)],
          success(data) {
               if (data.length) {
                    res.send(data[0]);
               } else {
                    res.send("暂无");
               }
          },
          error(err) {
               res.send(err)
          }
     })
})
//反馈
router.post("/all/fuck", (req, res) => {
     var json = req.body;
     pool.conn({
          sql: "select * from fk where uid=?",
          arr: [parseInt(json.uid)],
          success(data) {
               if (data.length) {
                    pool.conn({
                         sql: "update fk set fuck=? where uid=?",
                         arr: [json.textarea1, json.uid],
                         success(data) {
                              res.send("反馈已收到");
                         },
                         error(err) {
                              res.send(err);
                         }
                    })
               } else {
                    pool.conn({
                         sql: "insert into fk(uid,fuck) values(?,?)",
                         arr: [parseInt(json.uid), json.textareal],
                         success(data) {
                              res.send("反馈已收到");
                         },
                         error(err) {
                              res.send(err);
                         }
                    })
               }
          },
          error(err) {
               res.send(err);
          }
     })
})
//学生查看选项
router.post("/all/look", (req, res) => {
     var json = req.body.uid;
     pool.conn({
          sql: "select A.uid,A.name,A.score,A.master,A.masternum,A.teacher,A.teachernum,B.date,B.fenzhi,C.newroom from student as A,koufen as B,sushe as C where A.uid=? and B.uid=A.uid and C.uid=A.uid",
          arr: [parseInt(json)],
          success(data) {
               var result = {};
               if (data.length) {
                    result.msg = data[0];
                    pool.conn({
                         sql: "select name from sushe where newroom=?",
                         arr: [result.msg.newroom],
                         success(data) {
                              result.people = data;
                              res.send(result);
                         },
                         error(err) {
                              res.send(err);
                         }
                    })
               } else {
                    pool.conn({
                         sql: "select A.uid,A.name,A.score,A.master,A.masternum,A.teacher,A.teachernum,C.newroom from student as A,sushe as C where A.uid=? and C.uid=A.uid",
                         arr: [parseInt(json)],
                         success(data) {
                              if (data.length) {
                                   result.msg = data[0];
                                   pool.conn({
                                        sql: "select name from sushe where newroom=?",
                                        arr: [result.msg.newroom],
                                        success(data) {
                                             result.people = data;
                                             res.send(result);
                                        },
                                        error(err) {
                                             res.send(err);
                                        }
                                   })
                              } else {
                                   pool.conn({
                                        sql: "select A.uid,A.name,A.score,A.master,A.masternum,A.teacher,A.teachernum,C.date,C.fenzhi from student as A,koufen as C where A.uid=? and C.uid=A.uid",
                                        arr: [parseInt(json)],
                                        success(data) {
                                             if (data.length) {
                                                  result.msg = data[0];
                                                  res.send(result);
                                             } else {
                                                  pool.conn({
                                                       sql: "select uid,name,score,master,masternum,teacher,teachernum from student where uid=?",
                                                       arr: [parseInt(json)],
                                                       success(data) {
                                                            if (data.length) {
                                                                 result.msg = data[0];
                                                                 res.send(result);
                                                            } else {
                                                                 res.send("没有此学生信息");
                                                            }
                                                       },
                                                       error(err) {
                                                            res.send(err);
                                                       }
                                                  })
                                             }
                                        },
                                        error(err) {
                                             res.send(err);
                                        }
                                   })
                              }
                         },
                         error(err) {
                              res.send(err);
                         }
                    })
               }
          },
          error(err) {
               res.send(err);
          }
     })
})
//搜索功能
router.post("/all/search", (req, res) => {
     var json = req.body;
     pool.conn({
          sql: "select * from teacher where uid=?",
          arr: [parseInt(json.tuid)],
          success(data) {
               pool.conn({
                    sql: "select uid,name from student where uid like '%?%' and teacher=?",
                    arr: [parseInt(json.xuehaoss), data[0].name],
                    success(data) {
                         res.send(data);
                    },
                    erro(err) {
                         res.send(err);
                    }
               })
          },
          error(err) {
               res.send(err)
          }
     })

})
//获取所有老师
router.post("/all/tetclass", (req, res) => {
     pool.conn({
          sql: "select uid from classroom",
          success(data) {
               res.send(data);
          },
          error(err) {
               res.send(err)
          }
     })
})
//获取所有老师
router.post("/all/tet", (req, res) => {
     pool.conn({
          sql: "select name from teacher",
          success(data) {
               res.send(data);
          },
          error(err) {
               res.send(err)
          }
     })
})
//学号查询
router.post("/all/query", (req, res) => {
     var json = req.body;
     pool.conn({
          sql: "select * from student where uid=?",
          arr: [parseInt(json.uid)],
          success(data) {
               if (data.length) {
                    var result = {};
                    result.tip = "此学生存在";
                    result.score = data[0].score
                    res.send(result);
               } else {
                    res.send("暂无此学生信息");
               }
          },
          error(err) {
               res.send(err);
          }
     })
})
//综合积分查询
router.post("/all/jfquery", (req, res) => {
     pool.conn({
          sql: "select * from koufen",
          success(data) {
               res.send(data);
          },
          error(err) {
               res.send(err);
          }
     })
})
//综合积分扣除
router.post("/all/kjf", (req, res) => {
     var json = req.body.inputs;
     pool.conn({
          sql: "select * from koufen where uid=?",
          arr: [parseInt(json.xuehao)],
          success(data) {
               if (data.length) {
                    pool.conn({
                         sql: "update koufen set name=?,date=?,yuanyin=?,fenzhi=? where uid=?",
                         arr: [json.koufenren, json.shijian, json.yuanyin, json.fenzhi, parseInt(json.xuehao)],
                         success(data) {
                              pool.conn({
                                   sql: "select * from koufen",
                                   success(data) {
                                        pool.conn({
                                             sql: "update student set score=? where uid=?",
                                             arr: [parseInt(json.score) - parseInt(json.fenzhi), parseInt(json.xuehao)],
                                             success(data) {
                                             },
                                             error(err) {
                                                  res.send(err);
                                             }
                                        });
                                        var result = {};
                                        result.tip = "扣分成功";
                                        result.change = data;
                                        res.send(result);
                                   },
                                   error(err) {
                                        res.send(err);
                                   }
                              })
                         },
                         error(err) {
                              res.send(err);
                         }
                    })
               } else {
                    pool.conn({
                         sql: "insert into koufen(uid,name,date,yuanyin,fenzhi) values(?,?,?,?,?)",
                         arr: [parseInt(json.xuehao), json.koufenren, json.shijian, json.yuanyin, json.fenzhi],
                         success(data) {
                              pool.conn({
                                   sql: "select * from koufen",
                                   success(data) {
                                        pool.conn({
                                             sql: "update student set score=? where uid=?",
                                             arr: [parseInt(json.score) - parseInt(json.fenzhi), parseInt(json.xuehao)],
                                             success(data) {
                                                  console.log(123);
                                             },
                                             error(err) {
                                                  res.send(err);
                                             }
                                        });
                                        var result = {};
                                        result.tip = "扣分成功";
                                        result.change = data;
                                        res.send(result);
                                   },
                                   error(err) {
                                        res.send(err);
                                   }
                              })
                         },
                         error(err) {
                              res.send(err);
                         }
                    })
               }
          }
     })
})
//删除宿舍信息 
router.post("/all/delss", (req, res) => {
     var json = req.body.uid;
     pool.conn({
          sql: "delete from sushe where uid=?",
          arr: [parseInt(json)],
          success(data) {
               res.send("删除成功");
          },
          error(err) {
               res.send(err);
          }
     })
})
//修改宿舍信息  添加旧宿舍
router.post("/all/changess", (req, res) => {
     var json = req.body;
     pool.conn({
          sql: "update sushe set bed=?,week=?,oldroom=?,newroom=? where uid=?",
          arr: [json.dataLists.bednum, json.dataLists.weeknum, json.dataLists.oldroom, json.dataLists.newrooms, parseInt(json.uid)],
          success(data) {
               pool.conn({
                    sql: "select * from sushe where uid=?",
                    arr: [parseInt(json.uid)],
                    success(data) {
                         if (data.length) {
                              var result = {};
                              result.tip = "修改完成";
                              result.changess = data[0];
                              res.send(result);
                         } else {
                              res.send("暂时没数据");
                         }
                    },
                    error(err) {
                         res.send(err);
                    }
               })
          },
          error(err) {
               res.send(err);
          }
     })
})
//显示所有宿舍
router.post("/all/ss", (req, res) => {
     pool.conn({
          sql: "select * from sushe",
          success(data) {
               if (data.length) {
                    res.send(data);
               } else {
                    res.send("暂时没数据");
               }
          },
          error(err) {
               res.send(err);
          }
     })
})
//管理员删除排课
router.post("/all/delke", (req, res) => {
     var json = req.body.uid;
     pool.conn({
          sql: "select * from paike where uid=?",
          arr: [parseInt(json)],
          success(data) {
               pool.conn({
                    sql: "delete from paike where uid=?",
                    arr: [parseInt(json)],
                    success(data) {
                         res.send("删除成功");
                    },
                    error(err) {
                         res.send(err);
                    }
               })
          },
          erro(err) {
               res.send(err);
          }
     })
})
//管理员查看排课信息
router.post("/all/kecheng", (req, res) => {
     pool.conn({
          sql: "select * from paike",
          success(data) {
               if (data.length) {
                    res.send(data);
               } else {
                    res.send("暂时没有课程");
               }
          },
          error(err) {
               res.send(err);
          }
     })
})
//管理员操作
router.post("/all/admin", (req, res) => {
     var json = req.body.dataList;
     pool.conn({
          sql: "select * from paike where uid=?",
          arr: [parseInt(json.classroom)],
          success(data) {
               if (data.length) {
                    res.send("课程已存在");
               } else {
                    pool.conn({
                         sql: "insert into paike(uid,js,bs,subj,startday,endday) values(?,?,?,?,?,?)",
                         arr: [parseInt(json.classroom), json.teacher, json.master, json.kecheng, json.kaishishijian, json.jieshushijian],
                         success(data) {
                              pool.conn({
                                   sql: "select * from paike",
                                   success(data) {
                                        if (data.length) {
                                             res.send(data);
                                        } else {
                                             res.send("还未添加课程");
                                        }
                                   },
                                   error(err) {
                                        res.send(err);
                                   }
                              })
                         },
                         error(err) {
                              res.send(err);
                         }
                    })
               }
          },
          error(err) {
               res.send(err);
          }
     })
})
//老师查看学生详情
router.post("/all/sdetails", (req, res) => {
     var json = req.body;
     pool.conn({
          sql: "select A.*,B.newroom,C.yuanyin,C.fenzhi from student as A,sushe as B,koufen as C where A.uid=? and B.uid=A.uid and C.uid=A.uid",
          arr: [parseInt(json.uid)],
          success(data) {
               var result = {};
               if (data.length) {
                    result.msg = data[0];
                    pool.conn({
                         sql: "select name from sushe where newroom=?",
                         arr: [result.msg.newroom],
                         success(data) {
                              result.people = data;
                              res.send(result);
                         },
                         error(err) {
                              res.send(err);
                         }
                    })
               } else {
                    pool.conn({
                         sql: "select A.*,B.newroom from student as A,sushe as B where A.uid=? and B.uid=A.uid",
                         arr: [parseInt(json.uid)],
                         success(data) {
                              if (data.length) {
                                   var result = {};
                                   result.msg = data[0];
                                   pool.conn({
                                        sql: "select name from sushe where newroom=?",
                                        arr: [result.msg.newroom],
                                        success(data) {
                                             result.people = data;
                                             res.send(result);
                                        },
                                        error(err) {
                                             res.send(err);
                                        }
                                   })
                              } else {
                                   pool.conn({
                                        sql: "select A.*,B.fenzhi,B.yuanyin from student as A,koufen as B where A.uid=? and B.uid=A.uid",
                                        arr: [parseInt(json.uid)],
                                        success(data) {
                                             var result = {};
                                             if (data.length) {
                                                  result.msg = data[0];
                                                  res.send(result);
                                             } else {
                                                  pool.conn({
                                                       sql: "select * from student where uid=?",
                                                       arr: [parseInt(json.uid)],
                                                       success(data) {
                                                            var result = {};
                                                            result.msg = data[0];
                                                            res.send(result);
                                                       },
                                                       error(err) {
                                                            res.send(err);
                                                       }
                                                  });
                                             }
                                        },
                                        error(err) {
                                             res.send(err);
                                        }
                                   });
                              }
                         },
                         error(err) {
                              res.send(err);
                         }
                    });
               }
          },
          error(err) {
               res.send(err);
          }
     });
})
//学生状态
router.post("/all/statusxx", (req, res) => {
     var json = req.body.uid;
     pool.conn({
          sql: "select * from studentstatus where uid=?",
          arr: [parseInt(json)],
          success(data) {
               res.send(data);
          },
          error(err) {
               res.send(err)
          }
     })
})
//添加教室资产
router.post("/all/asset", (req, res) => {
     var json = req.body;
     pool.conn({
          sql: "update classroom set dians=?,tableds=?,yizi=?,kongt=? where uid=?",
          arr: [json.my.shan, json.my.mtable, json.my.myizi, json.my.mkong, parseInt(json.uid)],
          success(data) {
               pool.conn({
                    sql: "select * from classroom where uid=?",
                    arr: [parseInt(json.uid)],
                    success(data) {
                         var result = {};
                         result.tip = "修改完成";
                         result.asset = data[0];
                         res.send(result);
                    },
                    error(err) {
                         res.send(err);
                    }
               })
          },
          error(err) {
               res.send(err);
          }
     })
})
//删除班级
router.post("/all/deleclass", (req, res) => {
     var json = req.body.delList;
     pool.conn({
          sql: "delete from classroom where uid=?",
          arr: [parseInt(json)],
          success(data) {
               res.send("删除完成!");
          },
          error(err) {
               res.send(err);
          }
     })
})
//修改班级
router.post("/all/changeclassroom", (req, res) => {
     var json = req.body;
     pool.conn({
          sql: "update classroom set uid=? where uid=?",
          arr: [parseInt(json.newname), parseInt(json.uid)],
          success(data) {
               pool.conn({
                    sql: "select * from classroom",
                    success(data) {
                         var result = {};
                         result.tip = "修改完成";
                         result.room = data;
                         res.send(result);
                    },
                    erro(err) {
                         res.send(err);
                    }
               })
          },
          error(err) {
               res.send(err);
          }
     })
})
//查看当前所有班级
router.post("/all/class", (req, res) => {
     pool.conn({
          sql: "select * from classroom",
          success(data) {
               res.send(data);
          },
          error(err) {
               res.send(err);
          }
     })
})
//新增班级
router.post("/all/croom", (req, res) => {
     var json = req.body;
     pool.conn({
          sql: "select * from classroom where uid=?",
          arr: [parseInt(json.clroom)],
          success(data) {
               if (data.length) {
                    res.send("此班级已存在");
               } else {
                    pool.conn({
                         sql: "insert into classroom(uid) values(?)",
                         arr: [parseInt(json.clroom)],
                         success(data) {
                              pool.conn({
                                   sql: "select * from classroom",
                                   success(data) {
                                        var result = {};
                                        result.tip = "添加成功";
                                        result.room = data;
                                        res.send(result);
                                   },
                                   error(err) {
                                        res.send(err);
                                   }
                              })
                         },
                         erro(err) {
                              res.send(err);
                         }
                    })
               }
          },
          error(err) {
               res.send(err)
          }
     })
})
//分数查询
router.post("/all/testfind", (req, res) => {
     var json = req.body;
     pool.conn({
          sql: "select * from yuekao where teuid=?",
          arr: [json.teuid],
          success(data) {
               res.send(data);
          },
          error(err) {
               res.send(err);
          }
     })
})
//分数录入
router.post("/all/mouthtest", (req, res) => {
     var json = req.body;
     pool.conn({
          sql: "select * from yuekao where uid=?",
          arr: [json.lurust.uid],
          success(data) {
               if (data.length) {
                    pool.conn({
                         sql: "update yuekao set firstscore=?,twoscore=?,threescore=?,ykscore=?,changescore=?,mianscore=?,totalscore=?,status=?,why=? where uid=?",
                         arr: [json.changone, json.changtwo, json.changthree, json.changmonth, json.changjis, json.changmianshi, json.changzongh, json.changchongx, json.changyuanyin, json.lurust.uid],
                         success(data) {
                              pool.conn({
                                   sql: "select * from yuekao where teuid=?",
                                   arr: [json.teuid],
                                   success(data) {
                                        var result = {};
                                        result.tp = "ok";
                                        result.change = data;
                                        res.send(result);
                                   },
                                   error(err) {
                                        res.send(err)
                                   }
                              })
                         },
                         error(err) {
                              res.send(err);
                         }
                    })
               } else {
                    pool.conn({
                         sql: "insert into yuekao(uid,name,firstscore,twoscore,threescore,ykscore,changescore,mianscore,totalscore,status,teuid,why) values(?,?,?,?,?,?,?,?,?,?,?,?)",
                         arr: [json.lurust.uid, json.lurust.name, json.changone, json.changtwo, json.changthree, json.changmonth, json.changjis, json.changmianshi, json.changzongh, json.changchongx, json.teuid, json.changyuanyin],
                         success(data) {
                              pool.conn({
                                   sql: "select * from yuekao where teuid=?",
                                   arr: [json.teuid],
                                   success(data) {
                                        var result = {};
                                        result.tp = "ok";
                                        result.change = data;
                                        res.send(result);
                                   },
                                   error(err) {
                                        res.send(err)
                                   }
                              })
                         },
                         error(err) {
                              res.send(err)
                         }
                    })
               }
          }
     })
})
//宿舍查询
router.post("/all/sushemsg", (req, res) => {
     var json = req.body;
     pool.conn({
          sql: "select * from sushe where teach=?",
          arr: [json.teuid],
          success(data) {
               res.send(data);
          },
          error(err) {
               res.send(err);
          }
     })
})
//宿舍录入
router.post("/all/sushe", (req, res) => {
     var json = req.body;
     pool.conn({
          sql: "select * from sushe where uid=?",
          arr: [json.lurust.uid],
          success(data) {
               if (data.length) {
                    pool.conn({
                         sql: "update sushe set bed=?,week=?,newroom=? where uid=?",
                         arr: [json.lurubed, json.luruweek, json.luruapartment, json.lurust.uid],
                         success(data) {
                              pool.conn({
                                   sql: "select * from sushe where teach=?",
                                   arr: [json.teuid],
                                   success(data) {
                                        var result = {};
                                        result.tp = "ok";
                                        result.change = data;
                                        res.send(result);
                                   },
                                   error(err) {
                                        res.send(err)
                                   }
                              })
                         },
                         error(err) {
                              res.send(err);
                         }
                    })
               } else {
                    pool.conn({
                         sql: "insert into sushe(uid,bed,week,newroom,name,master,teacher,teach) values(?,?,?,?,?,?,?,?)",
                         arr: [json.lurust.uid, json.lurubed, json.luruweek, json.luruapartment, json.lurust.name, json.lurust.master, json.lurust.teacher, json.teuid],
                         success(data) {
                              pool.conn({
                                   sql: "select * from sushe where teach=?",
                                   arr: [json.teuid],
                                   success(data) {
                                        var result = {};
                                        result.tp = "ok";
                                        result.change = data;
                                        res.send(result);
                                   },
                                   error(err) {
                                        res.send(err)
                                   }
                              })
                         },
                         error(err) {
                              res.send(err)
                         }
                    })
               }
          }
     })
})
//老师修改学生状态
router.post("/all/sdstatus", (req, res) => {
     var json = req.body;
     pool.conn({
          sql: "select uid from studentstatus where uid=?",
          arr: [parseInt(json.synthesizeuid)],
          success(data) {
               if (data.length) {
                    pool.conn({
                         sql: "update studentstatus set status=?,daynum=?,startdays=?,enddays=?,subject=?,txsubject=?,txyy=?,notjobtime=?,notjobpic=?,handler=?,jobmsg=? where uid=?",
                         arr: [json.selected, json.qingjia.qingjiashichang ? json.qingjia.qingjiashichang : "", json.xiuxue.xukaishishijian ? json.xiuxue.xukaishishijian : "", json.xiuxue.xxjieshushijian ? json.xiuxue.xxjieshushijian : "", json.xiuxue.xxsuochujieduan ? json.xiuxue.xxsuochujieduan : "", json.tuixue.txsuozaijieduan ? json.tuixue.txsuozaijieduan : "", json.tuixue.txyuanyin ? json.tuixue.txyuanyin : "", json.bujiuye.bjyqiandingriqi ? json.bujiuye.bjyqiandingriqi : "", json.bujiuye.imgurlz ? json.bujiuye.imgurlz : "", json.selected == "不就业" ? json.laoshimingzi : "", json.biye.byxx ? json.biye.byxx : "", parseInt(json.synthesizeuid)],
                         success(data) {
                              res.send("添加成功");
                         },
                         error(err) {
                              res.send(err);
                         }
                    })
               } else {
                    pool.conn({
                         sql: "insert into studentstatus(uid,name,status,daynum,startdays,enddays,subject,txsubject,txyy,notjobtime,notjobpic,handler,jobmsg) values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                         arr: [parseInt(json.synthesizeuid), json.mingzi, json.selected, json.qingjia.qingjiashichang, json.xiuxue.xukaishishijian, json.xiuxue.xxjieshushijian, json.xiuxue.xxsuochujieduan, json.tuixue.txsuozaijieduan, json.tuixue.txyuanyin, json.bujiuye.bjyqiandingriqi, json.bujiuye.imgurlz, json.laoshimingzi, json.biye.byxx],
                         success(data) {
                              res.send("添加成功");
                         },
                         error(err) {
                              res.send(err);
                         }
                    })
               }
          },
          error(err) {
               res.send(err);
          }
     })
})
//老师修改学生局限信息
router.post("/all/changemsg", (req, res) => {
     var json = req.body;
     pool.conn({
          sql: "update student set score=?,moban=? where uid=?",
          arr: [json.synthesizeScore, json.lastBus, parseInt(json.synthesizeuid)],
          success(data) {
               pool.conn({
                    sql: "select * from student where uid=?",
                    arr: [parseInt(json.synthesizeuid)],
                    success(data) {
                         var result = {};
                         result.tp = "ok";
                         result.change = data[0];
                         res.send(result);
                    },
                    error(err) {
                         res.send(err);
                    }
               })
          },
          error(err) {
               res.send(err);
          }
     })
})
//老师班级学生
router.post("/all/mystudent", (req, res) => {
     var json = req.body.aname;
     pool.conn({
          sql: "select * from teacher where uid=?",
          arr: [json],
          success(data) {
               if (data.length) {
                    var teacherName = data[0].name;
                    pool.conn({
                         sql: "select * from student where teacher=?",
                         arr: [teacherName],
                         success(data) {
                              if (data.length) {
                                   res.send(data);
                              } else {
                                   res.send("暂时还没有学生");
                              }
                         },
                         error(err) {
                              res.send(err);
                         }
                    })
               } else {
                    res.send("请先添加老师信息");
               }
          },
          error(err) {
               res.send(err);
          }
     })
     // res.send("ok");
})
//新增老师
router.post("/all/teacher", (req, res) => {
     var json = req.body.params;
     pool.conn({
          sql: "select uid from teacher where uid=?",
          arr: [parseInt(json.uid)],
          success(data) {
               if (data.length) {
                    pool.conn({
                         sql: "update teacher set phonenumber=? where uid=?",
                         arr: [json.newTeacherPhone,parseInt(json.uid)],
                         success(data) {
                              res.send("此老师已在数据库,本次保存只对手机号生效!");
                         },
                         error(err) {
                              res.send(err);
                         }
                    })
               } else {
                    pool.conn({
                         sql: "insert into teacher(uid,name,phonenumber) values(?,?,?)",
                         arr: [parseInt(json.uid), json.newTeacherName, json.newTeacherPhone],
                         success(data) {
                              res.send("添加成功!!!");
                         },
                         error(err) {
                              res.send(err);
                         }
                    })
               }
          },
          error(err) {
               res.send(err);
          }
     })

})
//学生修改
router.post("/all/change", (req, res) => {
     var json = req.body.params;
     pool.conn({
          sql: "update student set phonenum=?,fnum=?,mnum=?,xzhi=?,xueji=? where uid=?",
          arr: [json.studentPhone, json.fatherPhone, json.matherPhone, json.schoolSystem, json.schoolCensus, parseInt(json.uid)],
          success(data) {
               res.send("修改完成!!!");
          },
          error(err) {
               res.send(err);
          }
     })
})
//学生添加
router.post("/all/add", (req, res) => {
     var json = req.body.params;
     pool.conn({
          sql: "select uid from student where uid=?",
          arr: [parseInt(json.uid)],
          success(data) {
               if (data.length) {
                    res.send("此学生已注册,不用再录入了");
               } else {
                    pool.conn({
                         sql: "insert into student(uid,cover,name,age,sex,IDcard,phonenum,fname,fnum,fjob,mname,mnum,mjob,address,bigarea,joinschool,xzhi,xueji,classroom,master,masternum,teacher,teachernum,score,moban) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                         arr: [parseInt(json.uid), json.imgurl, json.studentName, json.studentAge, json.studentSex, json.studentIdCard, json.studentPhone, json.fatherName, json.fatherPhone, json.fatherJob, json.matherName, json.matherPhone, json.matherJob, json.address, json.bigarea, json.admissionDate, json.schoolSystem, json.schoolCensus, json.classRoom, json.coordinator, json.coordinatorPhone, json.lecturerName, json.lecturerPhone, 0, 0],
                         success(data) {
                              res.send("注册成功!!");
                         },
                         error(err) {
                              res.send(err);
                         }
                    })
               }
          },
          error(err) {
               res.send(err);
          }
     })
})
//登录
router.post("/all/in", (req, res) => {
     var json = req.body.params;
     pool.conn({
          sql: "select * from login where uid=? and pwd=?",
          arr: [json.xuehao, json.mima],
          success(data) {
               if (data.length) {
                    var result = data[0];
                    result["tip"] = "登录成功";
                    result.pwd = "";
                    res.send(result);
               } else {
                    res.send("学号,工号或密码错误!!!");
               }
          },
          error(err) {
               res.send(err);
          }
     })
})
//注册
router.post('/all/up', (req, res) => {
     var json = req.body.params;
     pool.conn({
          sql: "select uid from login where uid=?",
          arr: [json.xuehao],
          success(data) {
               if (data.length) {
                    res.send("学号或工号已存在!");
               } else {
                    pool.conn({
                         sql: "insert into login(uid,pwd,logintype) values(?,?,?)",
                         arr: [json.xuehao, json.mima, json.logintype],
                         success(data) {
                              res.send("注册成功!!");
                         },
                         error(err) {
                              res.send(err);
                         }
                    })
               }
          },
          error(err) {
               res.send(err);
          }
     })
});

module.exports = router;