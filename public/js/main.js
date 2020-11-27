'use strict';

{
  function setWord() {
    // 単語を最後まで打ち込んだら次の単語をセットするメソッド
    // 配列の中からランダムなインデックスナンバーで取得
    // spliceメソッドで重複を回避する（ランダムに一つ削除しつつ、その値をwordに投げる）
    // spliceの返り値は必ず配列なのでインデックスナンバーを指定[0]
    word = words.splice(Math.floor(Math.random() * words.length), 1)[0];
    target.innerHTML = word;
    typedLetter.innerHTML = null;
    loc = 0;
  }

  // 様々なモードに対応する場合は別ファイルから参照した方が良い？
  const words = [
      'hello&nbspworld'
    // 'System.out.println',
    // 'console.log("はろー")',日本語未対応
    // 'body&nbsp{font-size:&nbsp42px;}',
    // 'text-decoration: none;',
    // 'display:&nbspflex;',
  ];
  let word;
  // 今打っている文字が何番目か取得するlocation
  let loc = 0;
  let startTime;
  let isPlaying = false;
  let typingSound = "UklGRjQIAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YRAIAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIB/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH9/f4B/gH+AgIB/gICAgICAgH9/f4CAgIB/f3+AgIB/gICAgIB/gH9/gICAf39/f4CAgH9/f39/gH9/f4B/gH9/f39/gH+Af4B/f3+Af4B/f3+AgIB/gH2AfYB0fX13iHeIiH2Gent3dIJ9g4ODgoGAgHyAf4B/g3yIg3qGd4N9doJ8gnyChYF9f4V7enqDe4OAd4CDgnqBfHp3fYGGenyJcIOCgXt3knF0iYF0dJF8d3SOfX12i4ZueoCGcYOGg3eBg391fYl2gn2FeoGGfX18gXyAfYJ/gICAgIGAgH2AgICAgn+AgIKAgIF/gICAgIOCgYCAgICAfYCAgoGCgICAgIB/gICAgICAgIB9fX+AgICAgH+AgH99fX19fYB/gIB9fX19fX99fXx9fX1+f35+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5/f39+fnx/fn9+gI6Mcm6Ah35sdXJui6KceoGAeHx0cnVxiIqIhY6Qgnx0emxzc3uFi5qOeoBweX+Ffnx4c4qLfn6ChISLenh+eHqEi4V/enyChoKAf3uBgXx/hICAf35/goSCgH9/gX97fn+BhYWAfnx/gYCAgICAgIB/f4CAgIGAgH9/f4B/fn+AgYB/f3+AgH99foCAgH9+f4B/f35/gIGAf31+f4CAfn1+f4CAf35/gICAf39/f39/fn6AgIB/f39/gIB/f3+Af39/f3+AgH9/gICAf39/f3+BgX9/f39/gICBgIB/f39/f3+Af3+AgIGAgYB/f39/gICAf3+AgYGBgH9/f4CAgH9/gIGBgYGAf39/f4CAgICAf4CAgICAgH9/f4CAgICAgH+AgIB/gIB/f4CAgH9/gICAgYB/f3+Af4CAgH9/gIGBgH9/f3+AgICAf39/gICAf39/f39/f39/f39/gICAgH9/f39/f39/f39/gICAgH9/f39/f39/f3+AgYCAf39/f39/f3+AgICAgICAgH9/f39/gICAgICAgIB/f39/gICAgIGAgH9/f39/f39/gIGBgICAgICAgH9/f4CAgICAgICAgICAgICAgICAgH9/f4CAgICAgICAf39/f4CAgICBgICAf39/f3+AgICAgICAgH9/f39/gICAgICAgH9/f39/gICAf4CAgICAf39/f4CAgICAgICAf39/f4CAgICAgH+Af4CAgIB/f3+AgIB/f4CAgICAgH9/f4CAgICAf39/gICAf35/f4CAgH9/f3+AgIB/f39/f3+AgICAgH9/f4CAgH9/f4CAgH9/f4CAgH9/f3+AgYB/f39/gICAf39/f3+AgIB/f39/f4B/f3+Af39/gICAgH9/f3+AgIB/f39/gH+Af39/gICAgH9/gICAgIB/gH+Af4R4gIB1fn+HfHiSdICEinxshYWGf3SFenqBiIJ2hICAdYCCgHp+iHp/hICAeYJ8gH+AgICAgoF5f358gHqGgIGAgIR/gXx8eXqFhIB/f4SGhYB6enp+goGAf39/goKAfH5+gIGEgX9/fn5+f4CAgYKCgH5+fn5/gICAgICAgIB/fn5/f4CAgICAf39+fn+AgICAgH5+fGd5j3V5g42Zn4RtfoZwWnt/d22AnZSUhoyEdnpwcnt2d32IioaLhXx8hH56f4R/en9/gHx6e4KAgISEhYaAen+BfHZ6enyAhIiFhYCBfnp7fICBgIB/f4CAgIGAfH9/fH+Af3t+goWCf39/fn+AgH58foCBgoGAfnx+gICAgICAf35/f3+AgICAgICAfn1+f3+AgICAgICAf39/f39/f39/gIGBgICAf39+fn1/f4CBgYCAgH9/f39/f3+AgIB/f3+AgICAgH9/f39/f39/f3+AgICAgICAgH9/f39/f39/gICAgICAgH9/gICAf39/f4CAgICAf3+AgH9/f3+AgICAf39/f39/gICAf3+AgICAf39/f39/gIB/f39/gICAgH9/f4CAgIB/f39/gICAgH9/f3+AgH9/f3+AgIB/gH9/gICAf39/f39/gICAf39/f39/f39/f4CAgH9/f39/gIB/f39/f3+AgICAf39/f38="
  // datauri scheme 形式にして Audio オブジェクトを生成
  typingSound = new Audio("data:audio/wav;base64," + typingSound);
  let wrongSound = "UklGRi4FAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YQoFAACAgICAgICAgICAgICAgICAgYGBgYGBgYGBgYGAgICAgICBg4aLkpukrbOzqZBtTTkwM0FWboSXpq6xrqedkIN2al9YVFRXXWZweoOMk5mcnp2blpCKgntzbWhlZGZpbnR6gIWJjI6Pj46MioeEgH57eHZ2dnh6fYCBg4ODgoCAfn59fX5/gIGChIWHiYqLi4uJhoF+eHNwbWxtcHR5f4SKkJWZm5ycmpaPiIB3bmZgXVxfZGt0foiSnKSpra2rpp6UiHtuYVdQTExQV2FufYqZpbC3u7u4sKWYiHlpWk5GQkJHUF1sfY2drLe/w8K9tKeYhnVkVEhAPD1DTVprfY6gr7vDx8bAtqiXhXNhUUU9OTpASllqfY+hsb7GysnCt6mXhHFfT0M6Nzg+SVdpfZCjs8DJzMvEuKmXg3BdTUE4NTY8R1dpfZCjtMHKzszEuKiVgW5cTD83MzU8R1dpfpGltsPM0M3GuaiVgW1aSj41MjQ7R1dqfpKmt8TN0M3FuKeTgGxZST01MjQ8SFhrf5Ont8TMz8zEt6aSf2tZSj43NDc+SlpsgJSnt8PLzcrCtaWSf2xaS0A5NjlATFttgJOmtcHIy8e/s6ORf2xbTEE7OTxDT15vgZSls7/Fx8S8sKCPfmxcTkQ+PD9HUmFyg5SlsrzCw8C4rZ6OfWxdUEZBP0NKVmR0hJSjsLm+v7y0qZyMfW1fU0pGRUlQW2h2hJOgqrG1trOso5eKfXBkWlNPT1NaY256hZCaoaapqaahmpGIfnVsZWBeX2JnbnZ/hYySlZiYmJWSjomEgHp2cnBvcHN2en6BhIaHh4aFhYSDgoGAgIB/f4CAgYOFhoaFhIF/e3h1dHR1d3p9gISIjI+Sk5STko6Jgnx0bWhkYmNmbHJ7gouTmqCkpaWinJWLgHVpX1dSUFJXYGp3g5Ccp6+0trSvp5uOgHBhVUtFQ0VMVmR0g5SjsLm/wb+4rqCPf21dT0Q+PD9HU2JzhJamtL7FxsO7r6CPfWtaTEE7Oj1FUWByhJeot8HHycW9sKCOfGlYST85ODtEUGBzhZmqucTKy8e+saCNemdVRzw3NjpCUGBzhpqsu8bMzci+sJ+LeGRTRTs1NTlCUGF1iZ2vvsjOzsm+r52JdWJQQzk0NDlDUWN3i5+xwMrPz8i9rZqGcl9OQTgzNDpFVGZ7jqO0wszQzse7qpeDb11MQDc0NjxIV2l9kaS1wsvOy8S3p5SAbVtMQDk2OUBMW22AlKa2wsnLyL+yopB9allLQDo4O0NQX3KEl6i3wsjJxbyvn417aFhKQDs6PkZTY3SGmKm2wMXGwbirm4p5Z1hLQj09QkpXZneImai1vsLCvbSomYl4aFlNRUFBRk9banqJmaaxuby7t66jlYZ4aVxRS0pOV2RzgY+aoaWjnpaKf3JmXFRPTlFXYW59jJyqtr7Dw761qJmJeWpcUkpISU5YZHOCk6Kvub/AvbWpmop6a11RSUVFSlJebX2NnKq1vL+9tqyejn5uX1NKRENGTllndoaWpbG6vr24r6GSgnJjVktFQ0VLVWJxgZKhrri9vrqyppeHd2dbVFFTWF5lbHN4fYCDhIWGhoaGhoWFhYWFhISEhISDg4ODgoKCgoKBgYGBgYGBgYGBgYGBgYGBgYGAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIA="
  wrongSound = new Audio("data:audio/wav;base64," + wrongSound);
  // 単語が表示されるエリアのid
  let target = document.getElementById('target');
  let typedLetter = document.getElementById('typedLetter');
  let elapsedTimeArea = document.getElementById('elapsedTimeArea');
  let correctTypeCountArea = document.getElementById('correctTypeCountArea');
  let wrongTypeCountArea = document.getElementById('wrongTypeCountArea');
  let accuracyArea = document.getElementById('accuracyArea');
  let correctTypeCount = 0;
  let wrongTypeCount = 0;

  document.addEventListener('click', () => {
    if (isPlaying === true) {
      return;
    }
    isPlaying = true;
    startTime = Date.now();
    setWord();
  })

  document.addEventListener('keydown', e => {
    if (e.key === word[loc]) {
      loc++
      correctTypeCount++;
      typedLetter.innerHTML = word.slice(0, loc);
      // 現在正しく打ち込めているところまでをアンダースコアで置き換え、
      // substringメソッドでloc以降の文字列を取得し組み合わせていく
      target.innerHTML = word.substring(loc);
      // 再生し終わるのを待たずに連続再生させるため再生位置を最初に戻す
      typingSound.currentTime = 0;
      typingSound.play();
    } else if (e.keyCode == 16){
      // シフトキーが押されてもノーカウントにする
      return;
    } else if (e.keyCode == 32 && word[loc] == '&') {
      // 半角スペースを入力できるようにする例外処理
      typingSound.play();
      loc += 5;
      typedLetter.innerHTML = word.slice(0, loc);
      target.innerHTML = word.substring(loc);
      // スペースが入力されたかよくわからない
    } else {
      wrongSound.currentTime = 0;
      wrongSound.play();
      wrongTypeCount++;
      return;
    }
    // 単語を最後まで打ち込んだ時にsetWordを呼び出す
    if (loc === word.length) {
      if (words.length === 0) {
        // ゲームが開始されてから最後の単語を打ち終えるまでの時間を計算
        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
        let typeCount = correctTypeCount + wrongTypeCount;
        let accuracy = ((correctTypeCount / typeCount).toFixed(2) * 100);
        const result = document.getElementById('result');
        let questionnaireArea = document.getElementById('questionnaireArea');
        let wordArea = document.getElementById('wordArea');
        wordArea.style.display ="none";
        result.textContent = 'Finished!';
        elapsedTimeArea.textContent = `time: ${elapsedTime}`;
        correctTypeCountArea.textContent = `correct type: ${correctTypeCount}`;
        wrongTypeCountArea.textContent = `wrong type: ${wrongTypeCount}`;
        accuracyArea.textContent = `accuracy: ${accuracy}%`;
        questionnaireArea.innerHTML = `<a href="https://docs.google.com/forms/d/e/1FAIpQLSeJejn-vHqPgMSA69kCMQ46lnoFCByYuvwl42uYyvGbxwSlXA/viewform" target="_blank" >アンケートにご協力ください<i class="fas fa-external-link-alt"></i></a>`;
        resultArea.style.display ="block";
        return;
      }
      setWord();
    }
  })
  let resultArea = document.getElementById('resultArea');
  resultArea.style.display ="none";
}

// TASKS-----------
// ・複数のモードを追加
// ・コードをダウンロードできるようにする
// ・先生モードcsv書き込みも
// リセットボタン追加