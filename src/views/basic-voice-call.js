import AgoraRTC from "agora-rtc-sdk-ng";

const rtc = {
  localAudioTrack: null,
  client: null,
};

const options = {
  // Pass your App ID here.
  appId: "5070f57c5e364cc9914a35f4de55090b",
  // Set the channel name.
  channel: "channel",
  // Pass your temp token here.
  token:
    "007eJxTYHjx3d5tcuOchDNaV3oO/3Kt1/Z1M1/mNe1qX/i0X/f5G3IUGEwNzA3STM2TTVONzUySky0tDU0SjU3TTFJSTU0NLA2SbvT8Twq9x5CcFhDJysgAgSA+O0NyRmJeXmoOAwMAQrkjeg==",
  // Set the user ID.
  uid: 123456,
};

async function startBasicCall() {
  // 创建 AgoraRTCClient 对象
  rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  // 监听 "user-published" 事件
  rtc.client.on("user-published", async (user, mediaType) => {
    // 订阅远程用户 当收到 "user-published" 事件
    await rtc.client.subscribe(user, mediaType);
    console.log("subscribe success");

    // 如果远程用户发布了一个音频音轨，就订阅并播放
    if (mediaType === "audio") {
      // 获得远程音轨对象 in the AgoraRTCRemoteUser object.
      const remoteAudioTrack = user.audioTrack;
      // Play the remote audio track.
      remoteAudioTrack.play();
    }

    // 监听 "user-unpublished" 事件
    rtc.client.on("user-unpublished", async (user) => {
      // 取消订阅 Unsubscribe from the tracks of the remote user.
      await rtc.client.unsubscribe(user);
    });
  });

  window.onload = function () {
    document.getElementById("join").onclick = async function () {
      // 加入 RTC 频道
      await rtc.client.join(
        options.appId,
        options.channel,
        options.token,
        options.uid
      );
      // 创建本地音频音轨 from the audio sampled by a microphone.
      rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // Publish the local audio tracks to the RTC channel.
      await rtc.client.publish([rtc.localAudioTrack]);

      console.log("publish success!");
    };

    document.getElementById("leave").onclick = async function () {
      // Destroy the local audio track.
      rtc.localAudioTrack.close();

      // Leave the channel.
      await rtc.client.leave();
    };
  };
}

startBasicCall();
