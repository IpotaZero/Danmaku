const SceneManager = class {
    constructor(_scene) {
        this.currentScene = _scene;
    }

    MoveTo(_scene) {
        this.currentScene.End();
        this.currentScene = _scene;
        this.currentScene.Start();
    }
}

const Scene = class {
    constructor() {

    }

    Start() {

    }

    End() {

    }

    Update() {

    }
}

let bullets = [];
let enemies = [];
let nextBullets = [];
let nextEnemies = [];
let player = {};
let b0 = {
    life: 1, type: "friend", p: new vec(0, 0), v: new vec(0, 0), r: 6,
    f: [(me) => {
        me.p = me.p.add(me.v);

        if (wall(me)) { me.life = 0; }
    }]
};

ImgData.Nicotine = new Image(); ImgData.Nicotine.src = "images/Nicotine_resize.png";
ImgData.Fructose = new Image(); ImgData.Fructose.src = "images/Fructose_resize.png";
ImgData.Title = new Image(); ImgData.Title.src = "images/Title_resize.png";

let stories = [
    [
        ["text", "Nicotine:\nHallo! 非行少年! お巡りさんだぞ!", ImgData.Nicotine],
        ["text", "Nicotine:\nこんな夜中に街をうろつきおって...", ImgData.Nicotine],
        ["text", "Nicotine:\n今から貴様に罰を与えてやろう!", ImgData.Nicotine],
        ["enemy", EnemiesData.enemy_0]
    ],
    [
        ["text", "Fructose:\nおいしいものはさァ", ImgData.Fructose],
        ["text", "Fructose:\n食べるかァ、食べないかァ、迷っちゃうよね", ImgData.Fructose],
        ["text", "Fructose:\nそれはナゼなら、\nおいしいものは罪でできているから!", ImgData.Fructose],
        ["enemy", EnemiesData.fructose_0]
    ]
];

SoundData.textSending = new Audio("Sounds/p.wav");
SoundData.decision = new Audio("sounds/p.wav");
SoundData.start = new Audio("sounds/pp.wav");
SoundData.cancel = new Audio("Sounds/cancel.wav");

SoundData.Guilt = new Audio("sounds/Guilt.wav");
SoundData.Conflict = new Audio("sounds/Conflict.wav");
SoundData.bgm_op = new Audio("sounds/bgm_op.wav");

function wall(obj) { return obj.p.x < 0 || gamewidth < obj.p.x || obj.p.y < 0 || gameheight < obj.p.y; }
function istouched(obj0, obj1) { return obj0.p.sub(obj1.p).length <= obj0.r + obj1.r; }

const Scene0 = class extends Scene {
    constructor() {
        super();
        this.bullet_mode = "kirei";
        this.bullet_mode2 = "ichibu";
        this.angle_mode = "jidou";
        this.chapter = 0;
    }

    Start() {
        this.frame = 0;
        this.frame1 = 0;
        this.pause = false;

        this.star = [];

        BGM.volume = 0.4;
        playSound(BGM, "as bgm");

        bullets = [];
        enemies = [{ ...EnemiesData.enemy_first }];
        nextBullets = [];
        nextEnemies = [];

        player = { p: new vec(20, gameheight / 2), v: new vec(0, 0), r: 3, speed: 16, angle: 0, life: 12, inv: 0, damage: 1 };

        this.storyMode = true;
        this.storyNum = 0;
        this.storyFrame = 0;
        this.score = 0;
        this.graze = 0;

        this.ending = false;
        this.endingFrame = 0;

        BGM.currentTime = 0;
    }

    End() {
        BGM.pause();
    }

    keyMove(v, speed) {
        if (pressed.includes("ArrowRight")) { v.x += speed; }
        if (pressed.includes("ArrowLeft")) { v.x -= speed; }
        if (pressed.includes("ArrowDown")) { v.y += speed; }
        if (pressed.includes("ArrowUp")) { v.y -= speed; }
    }

    Update() {

        if (this.pause) {
            this.keyMove(Icamera.p, 24);
            this.frame1++;
        } else {
            this.playerMove();
            this.danmaku();
        }

        if (pushed.includes("Escape")) {
            this.pause = !this.pause;
            this.frame1 = 0;

            if (this.pause) {
                BGM.pause()
            } else {
                playSound(BGM, "as bgm");
                playSound(SoundData.cancel);
            }
        }

        if (pushed.includes("Delete")) {
            enemies[0].life = 0;
        }

        this.draw();

        if (this.ending) {
            this.endingFrame++;
            Irect(0, 0, width, height, "rgba(0,0,0," + this.endingFrame / 48 + ")");
            if (this.endingFrame == 48) {
                scenemanager.MoveTo(scene1);
            }
        }

        this.frame++;
    }

    story() {
        if (this.storyMode) {
            Ifont(24, "white", "serif");

            let t = "";

            let image = null;

            SoundData.text = true;

            let s = stories[this.chapter][this.storyNum];

            if (s[0] == "text") {
                t = s[1];
                image = s[2];
            } else if ("enemy") {
                enemies = [{ ...s[1] }];
                this.storyMode = false;
            }

            if (image != null) { ctx.drawImage(image, 350, Iheight - 400, 400, 400); }

            Itext5(this.storyFrame, 200, Iheight + fontsize, fontsize, t);

            if (pushed.includes("ok")) { this.storyNum++; this.storyFrame = 0; }

            this.storyFrame++;
        }
    }

    danmaku() {
        bullets.push(...nextBullets);
        nextBullets = [];

        //弾
        bullets.forEach((b) => {
            b.f.forEach((fun) => { fun(b); });
            let p = { ...player };
            p.r += 12;
            if (!config.muteki && player.inv == 0 && b.type == "enemy" && istouched(p, b)) {
                if (!b.grazed) { this.graze++; this.score += 100; playSound(SoundData.graze); b.grazed = true; }
                if (istouched(player, b)) {
                    player.life--;
                    b.life = 0;
                    player.p = new vec(20, gameheight / 2);
                    player.inv = 24;
                    bullets = [];
                }
            }
        });

        enemies.push(...nextEnemies);
        nextEnemies = [];

        //敵
        enemies.forEach((e) => {
            bullets.forEach((b) => {
                if (b.type == "friend" && !e.muteki && istouched(e, b)) {
                    e.life -= player.damage;
                    b.life = 0;
                    this.score++;
                    SoundData.damage.currentTime = 0;
                    playSound(SoundData.damage);
                }
            });
            e.Update(e);
        });

        enemies = enemies.filter((e) => { return e.life > 0; });
        bullets = bullets.filter((b) => { return b.life > 0; });

        if (player.life <= 0) { scenemanager.MoveTo(scene1); }
    }

    playerMove() {
        //移動速度
        player.speed = pressed.includes("ShiftLeft") ? 8 : 16;

        //移動
        player.v = new vec(0, 0);
        this.keyMove(player.v, 1);
        player.p = player.p.add(player.v.nor().mlt(player.speed));

        //壁
        if (player.p.x < 0) { player.p.x = 0; }
        if (gamewidth < player.p.x) { player.p.x = gamewidth; }
        if (player.p.y < 0) { player.p.y = 0; }
        if (gameheight < player.p.y) { player.p.y = gameheight; }

        //カメラの追従
        Icamera.v = player.p.sub(Icamera.p).sub(new vec(width / 2, Iheight / 2)).mlt(1 / 6);
        Icamera.p = Icamera.p.add(Icamera.v);

        //カメラの壁
        if (Icamera.p.x < 0) { Icamera.p.x = 0; }
        if (gamewidth - width < Icamera.p.x) { Icamera.p.x = gamewidth - width; }
        if (Icamera.p.y < 0) { Icamera.p.y = 0; }
        if (gameheight - Iheight < Icamera.p.y) { Icamera.p.y = gameheight - Iheight; }

        //回転
        if (pushed.includes("KeyA")) { player.angle = (player.angle + 7) % 8; }
        if (pushed.includes("KeyX")) { player.angle = (player.angle + 1) % 8; }

        //弾の発射
        if (this.frame % 3 == 0) { bullets.push(...remodel([b0], ["p", player.p, "v", new vec(30, 0).rot(Math.PI / 4 * player.angle), "nway", 3, Math.PI / 12, player.p])); }

        //敵の方向を示す(0番目だけ)
        if (enemies.length > 0) {
            bullets.push(...remodel([b0], ["type", "neutral", "p", player.p.add(enemies[0].p.sub(player.p).nor().mlt(-30)), "v", enemies[0].p.sub(player.p).nor(), "arrow", 60, "v", new vec(0, 0), "wait", "frame", 1, (me) => { me.life = 0; }]));
            if (config.angle_mode == "jidou") {
                player.angle = Math.floor(getAngle(new vec(1, 0), enemies[0].p.sub(player.p)) / Math.PI * 4 + 0.5);
            }
        }

        //無敵時間
        if (player.inv > 0) { player.inv--; }

    }

    draw() {
        //背景
        ctx.clearRect(0, 0, width, height);
        Irect(0, 0, width, height, "rgba(15,15,15,1)")
        IrectC(0, 0, gamewidth, gameheight, "black");

        //星
        for (let i = 0; i < 256 - this.star.length; i++) {
            this.star.push({ p: new vec(Math.random() * gamewidth, Math.random() * gameheight), life: 60 * Math.random() });
        }
        this.star.forEach((s) => { Icircle(s.p.x - Icamera.p.x / 6, s.p.y - Icamera.p.y / 6, 2, "rgba(255,255,255," + s.life / 60 + ")"); s.life--; });
        this.star = this.star.filter((s) => { return s.life > 0; });

        //枠線
        IrectC(0, 0, gamewidth, gameheight, "red", "stroke", 4);

        let bulletsOnScreen = 0;

        //弾
        bullets.forEach((b) => {
            //画面内にあるなら
            if ((Icamera.p.x <= b.p.x && b.p.x <= Icamera.p.x + width && Icamera.p.y <= b.p.y && b.p.y <= Icamera.p.y + Iheight) || this.bullet_mode2 == "zenbu") {
                bulletsOnScreen++;

                if (b.type == "friend") {
                    IcircleC(b.p.x, b.p.y, 2, "rgba(255,255,255,0.5)");
                } else if (b.type == "neutral") {
                    IcircleC(b.p.x, b.p.y, b.r, "rgba(255,255,255,0.5)");
                } else if (b.type == "enemy") {
                    if (config.bullet_mode == "kirei") {
                        switch (b.app) {
                            case "ball":
                                for (let i = 0; i < 8; i++) {
                                    IcircleC(b.p.x, b.p.y, 1.6 * b.r * (1 - i / 8), "hsl(" + b.colour + ",100%," + (100 - 100 * i / 8) + "%)");
                                }
                                break;
                            case "laser":
                                let v = b.v;
                                if (v.x == 0 && v.y == 0) { v = new vec(0.01, 0); }//速度が0ベクトルだと方向が指定されなくなりますので
                                IlineC("hsl(" + b.colour + ",100%,50%)", b.r * 2 * 1.5, [[b.p.sub(v.nor().mlt(b.r * 1.5)).x, b.p.sub(v.nor().mlt(b.r * 1.5)).y], [b.p.add(v.nor().mlt(b.r * 1.5)).x, b.p.add(v.nor().mlt(b.r * 1.5)).y]]);
                                break;
                            case "donut":
                                IcircleC(b.p.x, b.p.y, 1.2 * b.r, "hsl(" + b.colour + ",100%,50%)", "stroke", 2);
                                break;
                        }
                    } else {
                        IcircleC(b.p.x, b.p.y, b.r, "red", "stroke");
                    }
                }
            }
        });

        //敵
        enemies.forEach((e) => {
            //体力バー
            IrectC(e.p.x - e.r, e.p.y - e.r - 12, 2 * e.r * e.life / e.maxlife, 6, "rgba(255,255,255,0.8)");
            IrectC(e.p.x - e.r, e.p.y - e.r - 12, 2 * e.r, 6, "white", "stroke", 2);
            //円
            IcircleC(e.p.x, e.p.y, e.r, "white", "stroke", 2);
            //画像
            if (e.app != null) { ctx.drawImage(e.app, e.p.x - Icamera.p.x - e.r, e.p.y - Icamera.p.y - e.r, 2 * e.r, 2 * e.r); }
        });

        //自機
        ctx.globalAlpha = 1 - player.inv / 24;
        IcircleC(player.p.x, player.p.y, player.r, "red");
        IcircleC(player.p.x, player.p.y, player.r + 12, "white", "stroke", 2);
        ctx.globalAlpha = 1;

        SoundData.text = false;

        Ifont(24, "white", "serif");

        Itext(100, -Icamera.p.x, gameheight + fontsize - Icamera.p.y, "ここに装飾とかお願いします");

        //下の
        Irect(0, Iheight, width, height - Iheight, "#0F0F0F");

        Iline("white", 2, [[0, Iheight], [width, Iheight]]);

        Ifont(24, "white", "serif");

        Itext4(this.frame, 0, Iheight + fontsize, fontsize, ["x:" + player.p.x, "y:" + player.p.y, "camera.x:" + Math.floor(Icamera.p.x), "camera.y:" + Math.floor(Icamera.p.y), "bullets:" + bullets.length, "bulletsOnScreen:" + bulletsOnScreen, "graze:" + this.graze, "score:" + this.score, "life:" + player.life, "invisible:" + player.inv]);

        this.story();

        if (this.pause) {
            SoundData.text = true;
            Ifont(48, "white", "serif");
            Itext(this.frame1, width - 5 * fontsize / 2, height, "Pause");
        }
    }
}

//タイトル画面
const Scene1 = class extends Scene {

    constructor() {
        super();
    }

    Start() {
        this.frame0 = 0;
        this.frame1 = 0;

        this.black = 0;

        this.select = "";
        this.preselect = 0;
        this.option = { "": ["始める", "操作方法", "ストーリー"], "0": ["Stage0", "Stage1"], "00": ["Easy"], "01": ["Easy"] };

        BGM = SoundData.bgm_op;
        BGM.currentTime = 0;
        playSound(BGM, "as bgm");
    }

    Update() {
        //画面消去
        ctx.clearRect(0, 0, width, height);
        Irect(0, 0, width, height, "rgba(15,15,15,1)")

        //フォント設定
        Ifont(48, "white", "serif");
        //タイトル
        Itext(this.frame0, 0, fontsize, "The Delightful Days!");

        ctx.drawImage(ImgData.Title, width - 400, height - 400, 400, 400);

        //選択肢
        Ifont(24, "white", "serif");

        if (this.black == 0) {
            switch (this.select) {
                case "1": Itext5(this.frame1, 0, 100, fontsize, "矢印キーで移動、Shiftキーで低速、AXで回転(デフォでは自動)\nESCでPause"); break;
                case "2": Itext5(this.frame1, 0, 100, fontsize, "ある日、世界にバグが生じ、奇妙な術、魔法を使うものが現れた!\nあなた↓はそのバグを取り除くために派遣されたプログラムである\n弾幕勝負で魔法使いたちを倒そう!"); break;

                case "000": scene0.chapter = 0; this.black = 1; BGM.pause(); BGM = SoundData.Guilt; break;
                case "010": scene0.chapter = 1; this.black = 1; BGM.pause(); BGM = SoundData.Conflict; break;

                default:
                    Itext4(this.frame1, fontsize, 100, fontsize, this.option[this.select]);
                    Itext(this.frame1, 0, 100 + this.preselect * fontsize, "→");
                    let num = this.option[this.select].length;
                    if (pushed.includes("ArrowUp")) { this.preselect = (this.preselect + num - 1) % num; playSound(SoundData.decision); }
                    if (pushed.includes("ArrowDown")) { this.preselect = (this.preselect + 1) % num; playSound(SoundData.decision); }
                    if (pushed.includes("ok")) {
                        this.select += this.preselect; this.preselect = 0; this.frame1 = 0;
                        playSound(SoundData.start);
                    }
            }

            if (pushed.includes("cancel") && this.select.length > 0) { this.select = this.select.slice(0, -1); this.frame1 = 0; playSound(SoundData.cancel); }
        }

        if (this.black > 0) { this.black++; }
        if (this.black == 48) { scenemanager.MoveTo(scene0); }

        Ifont(12);
        Itext(this.frame0, 0, height, "" + this.frame0);

        Irect(0, 0, width, height, "rgba(0,0,0," + this.black / 48 + ")");

        this.frame0++;
        this.frame1++;
    }
}

//タイトル画面でBGMを流すためのバッファ
const Scene2 = class extends Scene {
    constructor() {
        super()
        this.frame = 0
    }

    Update() {
        Irect(0, 0, width, height, "black")

        Ifont(48, "white", "serif")
        //中央ぞろえ
        let text = "Push KeyZ"
        let sub_text = text.slice(0, this.frame)
        length = ctx.measureText(sub_text).width
        Itext(this.frame, (width - length) / 2, height / 2, text)

        if (pushed.includes("ok")) {
            scenemanager.MoveTo(scene1)
        }

        this.frame++;
    }

}

const scene0 = new Scene0();
const scene1 = new Scene1();
const scene2 = new Scene2();

