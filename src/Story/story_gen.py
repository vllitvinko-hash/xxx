import json, glob, sherpa_onnx, soundfile as sf, numpy as np
FPS=30
SCENES=[0,150,360,660,1140,1500,1800,2160]  # кадры начала сцен (по таблице сценария)
d="vits-piper-ru_RU-dmitri-medium"
tts=sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
  vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=glob.glob(d+"/*.onnx")[0],tokens=d+"/tokens.txt",data_dir=d+"/espeak-ng-data"),num_threads=4)))
lines=json.load(open("story_lines.json"))
out=[]; cursor={}
for ln in lines:
    a=tts.generate(ln["text"],sid=0,speed=1.05)
    x=np.array(a.samples)
    # обрезаем тишину по краям
    nz=np.where(np.abs(x)>0.01)[0]; x=x[max(nz[0]-800,0):nz[-1]+1600]
    sf.write(f"public/story/{ln['id']}.wav",x,a.sample_rate)
    dur=int(np.ceil(len(x)/a.sample_rate*FPS))
    sc=ln["scene"]; start=cursor.get(sc,SCENES[sc]+6)
    out.append({"id":ln["id"],"scene":sc,"from":start,"frames":dur,"text":ln["sub"]})
    cursor[sc]=start+dur+8
for sc in range(7):
    end=cursor.get(sc); print(sc, "voice ends", end, "scene ends", SCENES[sc+1], "OK" if end<=SCENES[sc+1] else "OVER")
json.dump(out,open("src/Story/voice.json","w"),ensure_ascii=False,indent=1)
