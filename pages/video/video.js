// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGropList: [],//导航列表
    indexId: '',//导航标识
    videoList: [],//视频列表
    videoId: '',//视频id标识
    updataTime: [],//存储视频播放记录
    triggered: false,//刷新下拉更改
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGropList()
  },
  // 获取视频导航列表
  async getVideoGropList() {
    let videoData = await request("/video/group/list")
    let videoGropList = videoData.data.slice(0, 14)
    let indexId = videoGropList[0].id
    this.setData({
      videoGropList,
      indexId
    })
    // console.log(this.data.indexId,'123');
    this.getVideoList(this.data.indexId)
  },
  // 获取视频数据
  async getVideoList(indexId) {
    let videoList = await request("/video/group", { id: indexId })
    // console.log(videoList.datas);
    // 这里因为视频出不来，网上重新找的封装方法
    let videoInfoList = [];
    videoList.datas.forEach(i => {
      videoInfoList.push({
        id: i.data.vid,
        title: i.data.title,
        creator: i.data.creator,
        commentCount: i.data.commentCount,
        praisedCount: i.data.praisedCount,
        coverUrl: i.data.couverUrl,
        videoUrl: ""
      })
    })
    for (const i of videoInfoList) {
      let result = await request('/video/url', { id: i.id }).then(r => {
        i.videoUrl = r.urls[0].url
      })
    }
    /* console.log(videoList,'111');*/
    this.setData({
      // videoList:videoList.datas
      videoList: videoInfoList,
      triggered: false//下拉后收回
    })
    // 信息回来了关闭加载
    wx.hideLoading();
  },
  // 改变导航下标
  changeIndex(event) {
    // console.log("123",event.currentTarget.id);
    let id = event.currentTarget.id
    this.setData({
      // 把id转为数值型右移
      indexId: id >>> 0,
      // 每次切换视频列表为空
      videoList: []
    })
    // 未收到数据提示加载中
    wx.showLoading({
      title: '加载中',
    });
    // 改变导航内容视频内容跟着变
    this.getVideoList(this.data.indexId)

  },

  // 控制视频单个播放
  controlPlay(event) {
    // console.log(event,'123');
    let vid = event.target.id
    // 控制视频播放
    // 这里是单例模式
    // this.vid!==vid && this.videoContext && this.videoContext.stop()
    // console.log(123);
    // this.vid = vid
    this.setData({
      videoId: vid
    })
    this.videoContext = wx.createVideoContext(vid)
    // 在播放时查看是否有播放记录
    let { updataTime } = this.data
    let flag = updataTime.find(item => item.vid === event.target.id)
    if (flag) {
      this.videoContext.seek(flag.currentTime)
      console.log('seek');
    }
    // 自动播放
    this.videoContext.play()
  },
  // 控制视频跳转到之前播放的时间点
  handeltimeupdate(event) {
    let currentTime = event.detail.currentTime
    let { updataTime } = this.data
    let flag = updataTime.find(item => item.vid === event.target.id)
    if (flag) {
      flag.currentTime = currentTime
      // console.log(flag,'1111');
    } else {
      updataTime.push({ currentTime, vid: event.target.id })
    }
    this.setData({
      updataTime
    })
    // console.log(event);
  },
  // 下拉刷新
  onScrollRefresh() {
    // console.log('123');
    // 下拉从新获得数据
    this.getVideoList(this.data.indexId)
  },
  // 下拉底部刷新数据
  handleBotten() {
    // console.log('123');
    let newVideoList = [{
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
        "alg": "onlineHotGroup",
        "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
        "threadId": "R_VI_62_35D09C4748F7B68004DD8B2EB8E71EA3",
        "coverUrl": "https://p1.music.126.net/9tGTY1yZ7fBTBVzQxwGnNQ==/109951164172947957.jpg",
        "height": 1080,
        "width": 1920,
        "title": "180525 Jennie BLACKPINK - AS IF IT'S YOUR LAST",
        "description": null,
        "commentCount": 52,
        "shareCount": 93,
        "resolutions": [
          {
            "resolution": 240,
            "size": 55711659
          },
          {
            "resolution": 480,
            "size": 89135614
          },
          {
            "resolution": 720,
            "size": 128960798
          },
          {
            "resolution": 1080,
            "size": 191085767
          }
        ],
        "creator": {
          "defaultAvatar": false,
          "province": 500000,
          "authStatus": 0,
          "followed": false,
          "avatarUrl": "http://p1.music.126.net/Snn05VWuUdHV2KvBON9ikQ==/109951165516710812.jpg",
          "accountStatus": 0,
          "gender": 1,
          "city": 500101,
          "birthday": 832521600000,
          "userId": 1299210887,
          "userType": 0,
          "nickname": "韩国音乐现场精选",
          "signature": "",
          "description": "",
          "detailDescription": "",
          "avatarImgId": 109951165516710820,
          "backgroundImgId": 109951165395733630,
          "backgroundUrl": "http://p1.music.126.net/JoV68ORMXbVRqYMDNp28GA==/109951165395733633.jpg",
          "authority": 0,
          "mutual": false,
          "expertTags": null,
          "experts": {
            "1": "舞蹈视频达人"
          },
          "djStatus": 0,
          "vipType": 0,
          "remarkName": null,
          "avatarImgIdStr": "109951165516710812",
          "backgroundImgIdStr": "109951165395733633"
        },
        "urlInfo": null,
        "videoGroup": [
          {
            "id": 58100,
            "name": "现场",
            "alg": null
          },
          {
            "id": 1101,
            "name": "舞蹈",
            "alg": null
          },
          {
            "id": 57107,
            "name": "韩语现场",
            "alg": null
          },
          {
            "id": 57108,
            "name": "流行现场",
            "alg": null
          },
          {
            "id": 59108,
            "name": "巡演现场",
            "alg": null
          },
          {
            "id": 1100,
            "name": "音乐现场",
            "alg": null
          },
          {
            "id": 5100,
            "name": "音乐",
            "alg": null
          },
          {
            "id": 92105,
            "name": "BLACKPINK",
            "alg": null
          }
        ],
        "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_2558295001_UL6KOC4C.webp?wsSecret=aa4801aa078373c725c0e544d7b0065c&wsTime=1669899387",
        "previewDurationms": 4000,
        "hasRelatedGameAd": false,
        "markTypes": null,
        "relateSong": [
          {
            "name": "AS IF IT’S YOUR LAST",
            "id": 1325898352,
            "pst": 0,
            "t": 0,
            "ar": [
              {
                "id": 12068017,
                "name": "BLACKPINK",
                "tns": [

                ],
                "alias": [

                ]
              }
            ],
            "alia": [

            ],
            "pop": 100,
            "st": 0,
            "rt": null,
            "fee": 8,
            "v": 14,
            "crbt": null,
            "cf": "",
            "al": {
              "id": 74266151,
              "name": "BLACKPINK IN YOUR AREA",
              "picUrl": "http://p3.music.126.net/yKysEblB7-HOVrUCjvRhqw==/109951163678530141.jpg",
              "tns": [

              ],
              "pic_str": "109951163678530141",
              "pic": 109951163678530140
            },
            "dt": 212266,
            "h": {
              "br": 320000,
              "fid": 0,
              "size": 8492974,
              "vd": -77780
            },
            "m": {
              "br": 192000,
              "fid": 0,
              "size": 5095802,
              "vd": -77780
            },
            "l": {
              "br": 128000,
              "fid": 0,
              "size": 3397216,
              "vd": -77780
            },
            "a": null,
            "cd": "1",
            "no": 5,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [

            ],
            "djId": 0,
            "copyright": 0,
            "s_id": 0,
            "mv": 5566286,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 457010,
            "publishTime": 1542902400000,
            "privilege": {
              "id": 1325898352,
              "fee": 8,
              "payed": 0,
              "st": 0,
              "pl": 128000,
              "dl": 0,
              "sp": 7,
              "cp": 1,
              "subp": 1,
              "cs": false,
              "maxbr": 999000,
              "fl": 128000,
              "toast": false,
              "flag": 261,
              "preSell": false
            }
          }
        ],
        "relatedInfo": null,
        "videoUserLiveInfo": null,
        "vid": "35D09C4748F7B68004DD8B2EB8E71EA3",
        "durationms": 214022,
        "playTime": 178352,
        "praisedCount": 1121,
        "praised": false,
        "subscribed": false
      }
    },
    {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
        "alg": "onlineHotGroup",
        "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
        "threadId": "R_VI_62_1C5C5E53FFC8D42705393542626138B2",
        "coverUrl": "https://p1.music.126.net/vFcTe1_HoXPO_SdJY56IoQ==/109951163879274716.jpg",
        "height": 720,
        "width": 1280,
        "title": "看酸哥不带脏字Diss中国男孩，结果..",
        "description": "这段视频，看了30遍",
        "commentCount": 1983,
        "shareCount": 7179,
        "resolutions": [
          {
            "resolution": 240,
            "size": 27662290
          },
          {
            "resolution": 480,
            "size": 51253612
          },
          {
            "resolution": 720,
            "size": 96804432
          }
        ],
        "creator": {
          "defaultAvatar": false,
          "province": 500000,
          "authStatus": 0,
          "followed": false,
          "avatarUrl": "http://p1.music.126.net/4K8f4Lpvi8PlbUybtZSL-A==/109951164810367168.jpg",
          "accountStatus": 0,
          "gender": 2,
          "city": 500101,
          "birthday": -2209017600000,
          "userId": 1443582368,
          "userType": 0,
          "nickname": "Beloved0907",
          "signature": "",
          "description": "",
          "detailDescription": "",
          "avatarImgId": 109951164810367170,
          "backgroundImgId": 109951162868126480,
          "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
          "authority": 0,
          "mutual": false,
          "expertTags": null,
          "experts": {
            "1": "音乐视频达人"
          },
          "djStatus": 10,
          "vipType": 11,
          "remarkName": null,
          "avatarImgIdStr": "109951164810367168",
          "backgroundImgIdStr": "109951162868126486"
        },
        "urlInfo": null,
        "videoGroup": [
          {
            "id": 58100,
            "name": "现场",
            "alg": null
          },
          {
            "id": 1101,
            "name": "舞蹈",
            "alg": null
          },
          {
            "id": 4107,
            "name": "说唱",
            "alg": null
          },
          {
            "id": 5100,
            "name": "音乐",
            "alg": null
          },
          {
            "id": 4101,
            "name": "娱乐",
            "alg": null
          },
          {
            "id": 3101,
            "name": "综艺",
            "alg": null
          },
          {
            "id": 23116,
            "name": "音乐推荐",
            "alg": null
          },
          {
            "id": 79101,
            "name": "韩国综艺",
            "alg": null
          },
          {
            "id": 76108,
            "name": "综艺片段",
            "alg": null
          }
        ],
        "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_2328608766_iB80ifid.webp?wsSecret=54970cd611b5298897f0b5b89db31a80&wsTime=1669899387",
        "previewDurationms": 4000,
        "hasRelatedGameAd": false,
        "markTypes": null,
        "relateSong": [

        ],
        "relatedInfo": null,
        "videoUserLiveInfo": null,
        "vid": "1C5C5E53FFC8D42705393542626138B2",
        "durationms": 199466,
        "playTime": 9086849,
        "praisedCount": 63791,
        "praised": false,
        "subscribed": false
      }
    },
    {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
        "alg": "onlineHotGroup",
        "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
        "threadId": "R_VI_62_4A5D86F433D0F50787E2455997FC70D6",
        "coverUrl": "https://p1.music.126.net/ySmVmDzyeMYlHd5lc4mJ0g==/109951163671920585.jpg",
        "height": 1080,
        "width": 1920,
        "title": "结石姐《bangbang》被灵魂舞者霉霉实力抢镜，这腿长的逆",
        "description": "结石姐《bangbang》被灵魂舞者霉霉实力抢镜，这腿长的逆天了！",
        "commentCount": 147,
        "shareCount": 334,
        "resolutions": [
          {
            "resolution": 240,
            "size": 31858692
          },
          {
            "resolution": 480,
            "size": 53829499
          },
          {
            "resolution": 720,
            "size": 81994574
          },
          {
            "resolution": 1080,
            "size": 117870571
          }
        ],
        "creator": {
          "defaultAvatar": false,
          "province": 340000,
          "authStatus": 0,
          "followed": false,
          "avatarUrl": "http://p1.music.126.net/p_X_gt49W_SR5dIpDQVf6g==/109951163424476772.jpg",
          "accountStatus": 0,
          "gender": 1,
          "city": 340100,
          "birthday": 827683200000,
          "userId": 309396116,
          "userType": 0,
          "nickname": "坚果音乐秀",
          "signature": "音乐是唯一的力量，救赎我的灵魂",
          "description": "",
          "detailDescription": "",
          "avatarImgId": 109951163424476770,
          "backgroundImgId": 109951163571489730,
          "backgroundUrl": "http://p1.music.126.net/J5ugUVblg-l67Rxogp-6WA==/109951163571489734.jpg",
          "authority": 0,
          "mutual": false,
          "expertTags": null,
          "experts": {
            "1": "音乐视频达人"
          },
          "djStatus": 10,
          "vipType": 11,
          "remarkName": null,
          "avatarImgIdStr": "109951163424476772",
          "backgroundImgIdStr": "109951163571489734"
        },
        "urlInfo": null,
        "videoGroup": [
          {
            "id": 58100,
            "name": "现场",
            "alg": null
          },
          {
            "id": 57106,
            "name": "欧美现场",
            "alg": null
          },
          {
            "id": 57108,
            "name": "流行现场",
            "alg": null
          },
          {
            "id": 59108,
            "name": "巡演现场",
            "alg": null
          },
          {
            "id": 1100,
            "name": "音乐现场",
            "alg": null
          },
          {
            "id": 5100,
            "name": "音乐",
            "alg": null
          }
        ],
        "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_2122399375_lToH21mp.webp?wsSecret=619c774dff2f9552db4300d7d92d06b5&wsTime=1669899387",
        "previewDurationms": 4000,
        "hasRelatedGameAd": false,
        "markTypes": null,
        "relateSong": [
          {
            "name": "Bang Bang",
            "id": 28850212,
            "pst": 0,
            "t": 0,
            "ar": [
              {
                "id": 62662,
                "name": "Jessie J",
                "tns": [

                ],
                "alias": [

                ]
              },
              {
                "id": 48161,
                "name": "Ariana Grande",
                "tns": [

                ],
                "alias": [

                ]
              },
              {
                "id": 70183,
                "name": "Nicki Minaj",
                "tns": [

                ],
                "alias": [

                ]
              }
            ],
            "alia": [

            ],
            "pop": 100,
            "st": 0,
            "rt": null,
            "fee": 1,
            "v": 103,
            "crbt": null,
            "cf": "",
            "al": {
              "id": 2915046,
              "name": "Bang Bang",
              "picUrl": "http://p3.music.126.net/oA3lAYhcxmoPbfqUYHLbrQ==/109951163219135819.jpg",
              "tns": [

              ],
              "pic_str": "109951163219135819",
              "pic": 109951163219135820
            },
            "dt": 199346,
            "h": {
              "br": 320000,
              "fid": 0,
              "size": 7976795,
              "vd": -58846
            },
            "m": {
              "br": 192000,
              "fid": 0,
              "size": 4786094,
              "vd": -56363
            },
            "l": {
              "br": 128000,
              "fid": 0,
              "size": 3190744,
              "vd": -54940
            },
            "a": null,
            "cd": "1",
            "no": 1,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [

            ],
            "djId": 0,
            "copyright": 2,
            "s_id": 0,
            "mv": 325230,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 7003,
            "publishTime": 1406563200007,
            "privilege": {
              "id": 28850212,
              "fee": 1,
              "payed": 0,
              "st": 0,
              "pl": 0,
              "dl": 0,
              "sp": 0,
              "cp": 0,
              "subp": 0,
              "cs": false,
              "maxbr": 999000,
              "fl": 0,
              "toast": false,
              "flag": 4,
              "preSell": false
            }
          }
        ],
        "relatedInfo": null,
        "videoUserLiveInfo": null,
        "vid": "4A5D86F433D0F50787E2455997FC70D6",
        "durationms": 183879,
        "playTime": 511212,
        "praisedCount": 3055,
        "praised": false,
        "subscribed": false
      }
    },
    {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
        "alg": "onlineHotGroup",
        "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
        "threadId": "R_VI_62_A8DC4F82473F218B6F4A7560110BDF72",
        "coverUrl": "https://p1.music.126.net/54CsmlqzBwnGW3xUGI4ahw==/109951163804307053.jpg",
        "height": 1080,
        "width": 1920,
        "title": "本可成为张学友，却一心想当周星驰",
        "description": "本可成为张学友，却一心想当周星驰，他的这首歌，唱哭无数人",
        "commentCount": 1328,
        "shareCount": 1132,
        "resolutions": [
          {
            "resolution": 240,
            "size": 39751840
          },
          {
            "resolution": 480,
            "size": 69914355
          },
          {
            "resolution": 720,
            "size": 110467469
          },
          {
            "resolution": 1080,
            "size": 129835812
          }
        ],
        "creator": {
          "defaultAvatar": false,
          "province": 110000,
          "authStatus": 1,
          "followed": false,
          "avatarUrl": "http://p1.music.126.net/fQU_-56Vd8ld9kqvG_Rw1g==/3300733910865692.jpg",
          "accountStatus": 0,
          "gender": 1,
          "city": 110101,
          "birthday": 720353563017,
          "userId": 106810354,
          "userType": 4,
          "nickname": "中国音乐人",
          "signature": "我是偷影子的人，\n随风化成一朵云。",
          "description": "",
          "detailDescription": "",
          "avatarImgId": 3300733910865692,
          "backgroundImgId": 109951164271452850,
          "backgroundUrl": "http://p1.music.126.net/erbAKtwUefQuR1CJdEverQ==/109951164271452845.jpg",
          "authority": 0,
          "mutual": false,
          "expertTags": null,
          "experts": null,
          "djStatus": 10,
          "vipType": 0,
          "remarkName": null,
          "avatarImgIdStr": "3300733910865692",
          "backgroundImgIdStr": "109951164271452845"
        },
        "urlInfo": null,
        "videoGroup": [
          {
            "id": 58100,
            "name": "现场",
            "alg": null
          },
          {
            "id": 57105,
            "name": "粤语现场",
            "alg": null
          },
          {
            "id": 57108,
            "name": "流行现场",
            "alg": null
          },
          {
            "id": 57110,
            "name": "饭拍现场",
            "alg": null
          },
          {
            "id": 1100,
            "name": "音乐现场",
            "alg": null
          },
          {
            "id": 5100,
            "name": "音乐",
            "alg": null
          }
        ],
        "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_2258957983_EsN4hILw.webp?wsSecret=3537a5336032d1d98d241ef1da756b99&wsTime=1669899387",
        "previewDurationms": 4000,
        "hasRelatedGameAd": false,
        "markTypes": null,
        "relateSong": [
          {
            "name": "无赖",
            "id": 191171,
            "pst": 0,
            "t": 0,
            "ar": [
              {
                "id": 6473,
                "name": "郑中基",
                "tns": [

                ],
                "alias": [

                ]
              }
            ],
            "alia": [
              "电影《龙咁威II之皇母娘娘呢？》主题曲"
            ],
            "pop": 100,
            "st": 0,
            "rt": "600902000005652669",
            "fee": 1,
            "v": 126,
            "crbt": null,
            "cf": "",
            "al": {
              "id": 19313,
              "name": "正宗K 新曲+精选",
              "picUrl": "http://p3.music.126.net/2vFBKWUmF_jiWGaBgO6RaA==/17648261137761966.jpg",
              "tns": [

              ],
              "pic_str": "17648261137761966",
              "pic": 17648261137761966
            },
            "dt": 243000,
            "h": {
              "br": 320001,
              "fid": 0,
              "size": 9722819,
              "vd": -50329
            },
            "m": {
              "br": 192002,
              "fid": 0,
              "size": 5833709,
              "vd": -47731
            },
            "l": {
              "br": 128002,
              "fid": 0,
              "size": 3889154,
              "vd": -46047
            },
            "a": null,
            "cd": "1",
            "no": 3,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [

            ],
            "djId": 0,
            "copyright": 1,
            "s_id": 0,
            "mv": 0,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 7002,
            "publishTime": 1143849600000,
            "privilege": {
              "id": 191171,
              "fee": 1,
              "payed": 0,
              "st": 0,
              "pl": 0,
              "dl": 0,
              "sp": 0,
              "cp": 0,
              "subp": 0,
              "cs": false,
              "maxbr": 999000,
              "fl": 0,
              "toast": false,
              "flag": 4,
              "preSell": false
            }
          }
        ],
        "relatedInfo": null,
        "videoUserLiveInfo": null,
        "vid": "A8DC4F82473F218B6F4A7560110BDF72",
        "durationms": 291834,
        "playTime": 4212586,
        "praisedCount": 13103,
        "praised": false,
        "subscribed": false
      }
    },
    {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
        "alg": "onlineHotGroup",
        "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
        "threadId": "R_VI_62_380051E7B33267BB2185C5CE7AF9A9C4",
        "coverUrl": "https://p1.music.126.net/y4BBajqLLWgUQZmYz2nyEg==/109951163574308845.jpg",
        "height": 540,
        "width": 960,
        "title": "首位献唱维密的亚洲歌手，张靓颖表现得让人惊艳",
        "description": "张靓颖是首位献唱维密的亚洲歌手，而她在这场维密秀里表现得让人惊艳，这一part可以说是全场最佳了！——节选自《维多利亚的秘密2017》",
        "commentCount": 2508,
        "shareCount": 3720,
        "resolutions": [
          {
            "resolution": 240,
            "size": 45582999
          },
          {
            "resolution": 480,
            "size": 65800855
          }
        ],
        "creator": {
          "defaultAvatar": false,
          "province": 510000,
          "authStatus": 0,
          "followed": false,
          "avatarUrl": "http://p1.music.126.net/7Xy4RXjukkM9uuDAVfliOQ==/109951164540423873.jpg",
          "accountStatus": 0,
          "gender": 1,
          "city": 510100,
          "birthday": 723052800000,
          "userId": 16422771,
          "userType": 207,
          "nickname": "凌凌漆同学",
          "signature": "不定期更新超清港乐视频和邓紫棋张靓颖音乐视频。欢迎关注，谢谢！ 微博：凌凌漆学长 B站：凌凌漆同学",
          "description": "",
          "detailDescription": "",
          "avatarImgId": 109951164540423870,
          "backgroundImgId": 109951163254618670,
          "backgroundUrl": "http://p1.music.126.net/WngE-gOSwgM0lj8EGpUvfw==/109951163254618665.jpg",
          "authority": 0,
          "mutual": false,
          "expertTags": null,
          "experts": {
            "1": "影视视频达人",
            "2": "生活图文达人"
          },
          "djStatus": 10,
          "vipType": 11,
          "remarkName": null,
          "avatarImgIdStr": "109951164540423873",
          "backgroundImgIdStr": "109951163254618665"
        },
        "urlInfo": null,
        "videoGroup": [
          {
            "id": 58100,
            "name": "现场",
            "alg": null
          },
          {
            "id": 57106,
            "name": "欧美现场",
            "alg": null
          },
          {
            "id": 57108,
            "name": "流行现场",
            "alg": null
          },
          {
            "id": 1100,
            "name": "音乐现场",
            "alg": null
          },
          {
            "id": 5100,
            "name": "音乐",
            "alg": null
          },
          {
            "id": 15250,
            "name": "张靓颖",
            "alg": null
          }
        ],
        "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_1965140627_8KsSmSgn.webp?wsSecret=1f93ee3abb530e3a6233a19f6e34a07f&wsTime=1669899387",
        "previewDurationms": 4000,
        "hasRelatedGameAd": false,
        "markTypes": null,
        "relateSong": [

        ],
        "relatedInfo": null,
        "videoUserLiveInfo": null,
        "vid": "380051E7B33267BB2185C5CE7AF9A9C4",
        "durationms": 272370,
        "playTime": 7202550,
        "praisedCount": 40194,
        "praised": false,
        "subscribed": false
      }
    },
    {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
        "alg": "onlineHotGroup",
        "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
        "threadId": "R_VI_62_7E90B982F2EA200F49AC10FE31227C4D",
        "coverUrl": "https://p1.music.126.net/lkTWvCoo25vJ1U6550R0Vw==/109951163572670146.jpg",
        "height": 720,
        "width": 1280,
        "title": "滨崎步 - 《My All》演唱会现场版，全程含泪唱完！！！",
        "description": "【超清】滨崎步 -《My All》（2015 ARENA TOUR 演唱会）滨崎步全程含泪唱完，她感谢一直陪伴成长的伴舞们！她感谢一路不离不弃的歌迷们！满满的感动！值得收藏！！！ ",
        "commentCount": 3438,
        "shareCount": 27833,
        "resolutions": [
          {
            "resolution": 720,
            "size": 82395751
          }
        ],
        "creator": {
          "defaultAvatar": false,
          "province": 130000,
          "authStatus": 0,
          "followed": false,
          "avatarUrl": "http://p1.music.126.net/ExajWQkqw5aPbeEguQ33bQ==/19001759951471294.jpg",
          "accountStatus": 0,
          "gender": 1,
          "city": 130200,
          "birthday": 640442893121,
          "userId": 126831486,
          "userType": 207,
          "nickname": "绿竹青峰",
          "signature": "愿你走出半生，归来仍是少年 ！！！",
          "description": "",
          "detailDescription": "",
          "avatarImgId": 19001759951471296,
          "backgroundImgId": 18780758116025984,
          "backgroundUrl": "http://p1.music.126.net/zS0eUFSSj9HrBj2__tWRQA==/18780758116025983.jpg",
          "authority": 0,
          "mutual": false,
          "expertTags": null,
          "experts": {
            "1": "音乐视频达人"
          },
          "djStatus": 10,
          "vipType": 0,
          "remarkName": null,
          "avatarImgIdStr": "19001759951471294",
          "backgroundImgIdStr": "18780758116025983"
        },
        "urlInfo": null,
        "videoGroup": [
          {
            "id": 58100,
            "name": "现场",
            "alg": null
          },
          {
            "id": 9102,
            "name": "演唱会",
            "alg": null
          },
          {
            "id": 1100,
            "name": "音乐现场",
            "alg": null
          },
          {
            "id": 12100,
            "name": "流行",
            "alg": null
          },
          {
            "id": 5100,
            "name": "音乐",
            "alg": null
          },
          {
            "id": 14242,
            "name": "伤感",
            "alg": null
          }
        ],
        "previewUrl": null,
        "previewDurationms": 0,
        "hasRelatedGameAd": false,
        "markTypes": [
          101
        ],
        "relateSong": [
          {
            "name": "MY ALL",
            "id": 22737627,
            "pst": 0,
            "t": 0,
            "ar": [
              {
                "id": 16405,
                "name": "浜崎あゆみ",
                "tns": [

                ],
                "alias": [

                ]
              }
            ],
            "alia": [

            ],
            "pop": 100,
            "st": 0,
            "rt": "",
            "fee": 8,
            "v": 42,
            "crbt": null,
            "cf": "",
            "al": {
              "id": 2087820,
              "name": "GUILTY",
              "picUrl": "http://p4.music.126.net/vKn4n26btSPAdpEgW7X61w==/109951164762304097.jpg",
              "tns": [
                "原罪"
              ],
              "pic_str": "109951164762304097",
              "pic": 109951164762304100
            },
            "dt": 322546,
            "h": {
              "br": 320000,
              "fid": 0,
              "size": 12904533,
              "vd": -71544
            },
            "m": {
              "br": 192000,
              "fid": 0,
              "size": 7742737,
              "vd": -71544
            },
            "l": {
              "br": 128000,
              "fid": 0,
              "size": 5161839,
              "vd": -71544
            },
            "a": null,
            "cd": "1",
            "no": 12,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [

            ],
            "djId": 0,
            "copyright": 0,
            "s_id": 0,
            "mv": 5442866,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 457010,
            "publishTime": 1199116800000,
            "privilege": {
              "id": 22737627,
              "fee": 8,
              "payed": 0,
              "st": 0,
              "pl": 128000,
              "dl": 0,
              "sp": 7,
              "cp": 1,
              "subp": 1,
              "cs": false,
              "maxbr": 999000,
              "fl": 128000,
              "toast": false,
              "flag": 261,
              "preSell": false
            }
          }
        ],
        "relatedInfo": null,
        "videoUserLiveInfo": null,
        "vid": "7E90B982F2EA200F49AC10FE31227C4D",
        "durationms": 360000,
        "playTime": 4443888,
        "praisedCount": 38160,
        "praised": false,
        "subscribed": false
      }
    },
    {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
        "alg": "onlineHotGroup",
        "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
        "threadId": "R_VI_62_8D80A3A4A5B16B6C6AD6148D07E0DD37",
        "coverUrl": "https://p1.music.126.net/Xg_qxdqZmQPKp3pHq-1gog==/109951163990473323.jpg",
        "height": 1080,
        "width": 1920,
        "title": "前方核能！超燃神曲现场版，万人音乐演唱会现场太疯狂！",
        "description": "人气女王花泽香菜的《恋爱循环》有没有一种让你心动的感觉呢？《only my railgun》现任主唱南条爱乃，也是被称为最燃现场持有者，歌曲是TV动画《某科学的超电磁炮》的片头曲，《极乐净土》由90后MARIA演唱的歌曲，旋律血洗各大网站，舞蹈也是被疯狂模仿，日本，音乐现场，动漫。",
        "commentCount": 547,
        "shareCount": 606,
        "resolutions": [
          {
            "resolution": 240,
            "size": 38822367
          },
          {
            "resolution": 480,
            "size": 51231685
          },
          {
            "resolution": 720,
            "size": 75387184
          },
          {
            "resolution": 1080,
            "size": 135720569
          }
        ],
        "creator": {
          "defaultAvatar": false,
          "province": 320000,
          "authStatus": 0,
          "followed": false,
          "avatarUrl": "http://p1.music.126.net/8Y1SU7AOluwwydYEFbXwMw==/109951163801847081.jpg",
          "accountStatus": 0,
          "gender": 0,
          "city": 320700,
          "birthday": 684774000000,
          "userId": 1425128922,
          "userType": 0,
          "nickname": "零点音乐秀",
          "signature": "分享国内外好听的歌曲，给您不一样的音乐感受！",
          "description": "",
          "detailDescription": "",
          "avatarImgId": 109951163801847090,
          "backgroundImgId": 109951162868128400,
          "backgroundUrl": "http://p1.music.126.net/2zSNIqTcpHL2jIvU6hG0EA==/109951162868128395.jpg",
          "authority": 0,
          "mutual": false,
          "expertTags": null,
          "experts": null,
          "djStatus": 0,
          "vipType": 11,
          "remarkName": null,
          "avatarImgIdStr": "109951163801847081",
          "backgroundImgIdStr": "109951162868128395"
        },
        "urlInfo": null,
        "videoGroup": [
          {
            "id": 58100,
            "name": "现场",
            "alg": null
          },
          {
            "id": 1101,
            "name": "舞蹈",
            "alg": null
          },
          {
            "id": 1105,
            "name": "最佳饭制",
            "alg": null
          },
          {
            "id": 60101,
            "name": "日语现场",
            "alg": null
          },
          {
            "id": 57108,
            "name": "流行现场",
            "alg": null
          },
          {
            "id": 3110,
            "name": "宅舞",
            "alg": null
          },
          {
            "id": 1100,
            "name": "音乐现场",
            "alg": null
          },
          {
            "id": 5100,
            "name": "音乐",
            "alg": null
          },
          {
            "id": 15241,
            "name": "饭制",
            "alg": null
          }
        ],
        "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_2436744142_Tk5HbEiA.webp?wsSecret=904ff05629b0d7bd50d713fa8de23ec5&wsTime=1669899387",
        "previewDurationms": 4000,
        "hasRelatedGameAd": false,
        "markTypes": null,
        "relateSong": [

        ],
        "relatedInfo": null,
        "videoUserLiveInfo": null,
        "vid": "8D80A3A4A5B16B6C6AD6148D07E0DD37",
        "durationms": 200170,
        "playTime": 5031936,
        "praisedCount": 12829,
        "praised": false,
        "subscribed": false
      }
    },
    {
      "type": 1,
      "displayed": false,
      "alg": "onlineHotGroup",
      "extAlg": null,
      "data": {
        "alg": "onlineHotGroup",
        "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
        "threadId": "R_VI_62_047CD5F4DA639C4697542A46BCD2EC34",
        "coverUrl": "https://p1.music.126.net/shAJeiCRqgR7KnbDbWfSyQ==/109951164420560872.jpg",
        "height": 540,
        "width": 952,
        "title": "【Queendom】穗珍超绝椅子舞《Senorita》，是珍的辣！！",
        "description": "【Queendom】穗珍超绝椅子舞《Senorita》，是珍的辣！！",
        "commentCount": 321,
        "shareCount": 2187,
        "resolutions": [
          {
            "resolution": 240,
            "size": 9466668
          },
          {
            "resolution": 480,
            "size": 13603649
          }
        ],
        "creator": {
          "defaultAvatar": false,
          "province": 310000,
          "authStatus": 0,
          "followed": false,
          "avatarUrl": "http://p1.music.126.net/vYHGILLfWWof6ogz1HwxKQ==/109951164491145822.jpg",
          "accountStatus": 0,
          "gender": 2,
          "city": 310101,
          "birthday": 1262275200000,
          "userId": 1335061865,
          "userType": 207,
          "nickname": "仙宫频道",
          "signature": "plmm爱好者/个人收藏bot",
          "description": "",
          "detailDescription": "",
          "avatarImgId": 109951164491145820,
          "backgroundImgId": 109951164829202080,
          "backgroundUrl": "http://p1.music.126.net/PNGXsjXd_IYT0vvkXeoonQ==/109951164829202086.jpg",
          "authority": 0,
          "mutual": false,
          "expertTags": null,
          "experts": {
            "1": "音乐视频达人",
            "2": "音乐图文达人"
          },
          "djStatus": 10,
          "vipType": 0,
          "remarkName": null,
          "avatarImgIdStr": "109951164491145822",
          "backgroundImgIdStr": "109951164829202086"
        },
        "urlInfo": null,
        "videoGroup": [
          {
            "id": 58100,
            "name": "现场",
            "alg": null
          },
          {
            "id": 1101,
            "name": "舞蹈",
            "alg": null
          },
          {
            "id": 1100,
            "name": "音乐现场",
            "alg": null
          },
          {
            "id": 5100,
            "name": "音乐",
            "alg": null
          }
        ],
        "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_2732659965_y1Iq3j0O.webp?wsSecret=bebcb82ee24b8cce5e8afab2a1c95c38&wsTime=1669899387",
        "previewDurationms": 4000,
        "hasRelatedGameAd": false,
        "markTypes": null,
        "relateSong": [

        ],
        "relatedInfo": null,
        "videoUserLiveInfo": null,
        "vid": "047CD5F4DA639C4697542A46BCD2EC34",
        "durationms": 91668,
        "playTime": 1900451,
        "praisedCount": 12368,
        "praised": false,
        "subscribed": false
      }
    }
    ]
    let videoList = this.data.videoList
    console.log(123);
    videoList.push(...newVideoList)
    this.setData({
      videoList
    })
  },
  // 跳转搜索页面
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */


  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({from}) {
    // console.log(from);
    if(from === 'button'){
      return {title:'来自按钮的转发',
      path:"pages/video/video"
    }
    }else{
      return {
        title:'来自菜单的转发',
        path:'pages/video/video',
        imageUrl:'/static/images/nvsheng.jpg'
      }
    }
  }
})