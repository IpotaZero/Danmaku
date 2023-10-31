SoundData.graze = new Audio("sounds/graze.wav");
SoundData.damage = new Audio("sounds/bullet.wav");
SoundData.hakkyou = new Audio("sounds/hakkyou!.wav");
SoundData.KO = new Audio("sounds/KO.wav");

SoundData.shot = new Audio("sounds/explode.wav");
SoundData.charge = new Audio("sounds/charge0.wav");

ImgData.NicotineE = new Image(); ImgData.NicotineE.src = "images/NicotineE.png";

EnemiesData.enemy_first = {
	p: new vec(gamewidth / 2, gameheight / 2), life: 100, maxlife: 100, frame: 0, r: 48, app: null, muteki: true,
	Update: (me) => {
		me.frame++;
	}
};

EnemiesData.enemy_0 = {
	p: new vec(gamewidth / 2, gameheight / 2), life: 100, maxlife: 100, frame: 0, r: 48, app: ImgData.NicotineE,
	Update: (me) => {

		if (me.frame < 24) {
			me.p = vrs.p.add(new vec(gamewidth / 2 + width / 2, gameheight / 2).sub(vrs.p).mlt(me.frame / 24));
		} else {
			me.p = circleMove(new vec(gamewidth / 2, gameheight / 2), me.frame - 24, width / 2, 144);
			if (me.frame % 8 == 0) {
				Bullets.push(...remodel([bullet_model], ["p", me.p, "colourful", me.frame, "v", new vec(1, 0), "ex", 16, me.p]));
			}
		}

		me.frame++;

		if (me.life <= 0) {
			nextEnemies.push({ ...EnemiesData["enemy_3"] });
			Bullets = [];
			vrs.p = me.p;
			scene0.score += me.maxlife ** 2;
			playSound(SoundData.KO);
		}
	}
};

EnemiesData.enemy_1 = {
	p: new vec(gamewidth / 2, gameheight / 2), life: 100, maxlife: 100, frame: 0, r: 48, app: ImgData.NicotineE,
	Update: (me) => {

		if (me.frame < 24) {
			me.p = vrs.p.add(new vec(gamewidth / 2, gameheight / 2).sub(vrs.p).mlt(me.frame / 24));
		} else {
			if (me.frame % 24 == 0) {
				Bullets.push(...remodel([bullet_model], ["app", "ball", "r", 16, "colourful", me.frame, "p", me.p, "v", new vec(6, 0), "ex", 16, me.p]));
			}

			if (me.frame % 12 == 0) {
				Bullets.push(...remodel([bullet_model], [
					"type", "neutral",
					"p", me.p,
					"v", new vec(60, 0),
					"aim", player.p,
					"f", (me0) => {
						nextBullets.push(...remodel([bullet_model], ["type", "neutral", "p", me0.p, "wait", "frame", 16, (me1) => {
							me1.life = 0;
							nextBullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me1.p, "v", new vec(12, 0), "f", (me) => { me.colour += 12; }, "wait", "frame", 6, (me2) => { me2.life = 0; }, "ex", 16, me1.p]));
						}]));
					}]));
			}
		}

		me.frame++;

		if (me.life <= 0) {
			nextEnemies.push({ ...EnemiesData["enemy_2"] });
			Bullets = [];
			vrs.p = me.p;
			scene0.score += me.maxlife ** 2;
			playSound(SoundData.KO);
		}
	}
};

EnemiesData.enemy_2 = {
	p: new vec(gamewidth / 2, gameheight / 2), life: 100, maxlife: 100, frame: 0, r: 48, l: -24, app: ImgData.NicotineE,
	Update: (me) => {

		if (me.frame < 24) {
			me.p = vrs.p.add(new vec(gamewidth / 2, gameheight / 2).sub(vrs.p).mlt(me.frame / 24));
		} else {
			if (me.frame % 6 == 0) {
				Bullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me.p, "v", new vec(8, 0), "rot", 2 * Math.PI / 360 * me.frame, "arrow", 60, "ex", 12, me.p]));
			}
			Bullets.push(...remodel([bullet_model], ["colourful", me.frame + 30, "line", 6, [circleMove(me.p, me.frame, me.p.length * me.l / 144, 360, Math.PI), circleMove(me.p, me.frame, me.p.length * me.l / 144, 360)], "wait", "frame", 0, (me) => { me.life = 0; }]));
			Bullets.push(...remodel([bullet_model], ["colourful", me.frame + 30, "line", 6, [circleMove(me.p, me.frame, me.p.length * me.l / 144, 360, Math.PI / 2), circleMove(me.p, me.frame, me.p.length * me.l / 144, 360, 3 * Math.PI / 2)], "wait", "frame", 0, (me) => { me.life = 0; }]));
		}

		me.frame++;
		me.l = Math.min(144, me.l + 1);


		if (me.life <= 0) {
			nextEnemies.push({ ...EnemiesData["enemy_5"] });
			Bullets = [];
			vrs.p = me.p;
			scene0.score += me.maxlife ** 2;
			playSound(SoundData.KO);
		}
	}
};

EnemiesData.enemy_3 = {
	p: new vec(gamewidth / 2, gameheight / 2), life: 100, maxlife: 100, frame: 0, r: 48, app: ImgData.NicotineE,
	Update: (me) => {

		if (me.frame < 24) {
			me.p = vrs.p.add(new vec(gamewidth / 2, gameheight / 2).sub(vrs.p).mlt(me.frame / 24));
		} else {
			if (me.frame % 12 == 0) {
				Bullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me.p, "life", 2, "v", new vec(6, 0), "bound", "ex", 16, me.p, "wait", "frame", 24, (me) => { me.v = player.p.sub(me.p).nor().mlt(12) }]));
			}
		}

		me.frame++;

		if (me.life <= 0) {
			nextEnemies.push({ ...EnemiesData["enemy_4"] });
			Bullets = [];
			vrs.p = me.p;
			scene0.score += me.maxlife ** 2;
			playSound(SoundData.KO);
		}
	}
};

EnemiesData.enemy_4 = {
	p: new vec(gamewidth / 2, gameheight / 2), life: 100, maxlife: 100, frame: 0, r: 48, app: ImgData.NicotineE,
	Update: (me) => {

		if (me.frame < 24) {
			me.p = vrs.p.add(new vec(gamewidth / 2, gameheight / 2).sub(vrs.p).mlt(me.frame / 24));
		} else {
			me.p = me.p.add(player.p.sub(me.p).nor().mlt(12));

			if (me.frame % 12 == 0) {
				Bullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me.p, "v", new vec(12, 0), "aim", player.p, "frame", 0, "f", (me) => {
					if (me.frame < 24) { me.v = player.p.sub(me.p).nor().mlt(12); }
					me.frame++;
					nextBullets.push(...remodel([bullet_model], ["colour", me.colour, "p", me.p, "v", me.v, "wait", "frame", 1, (me) => { me.life = 0; }, "arrow", me.frame * 4]));
				}]));
			}
		}

		me.frame++;

		if (me.life <= 0) {
			nextEnemies.push({ ...EnemiesData["enemy_1"] });
			Bullets = [];
			vrs.p = me.p;
			scene0.score += me.maxlife ** 2;
			playSound(SoundData.KO);
		}
	}
};

EnemiesData.enemy_5 = {
	p: new vec(gamewidth / 2, gameheight / 2), life: 300, maxlife: 300, frame: 0, r: 48, hakkyou: false, app: ImgData.NicotineE,
	Update: (me) => {

		let interval = me.life > me.maxlife / 2 ? 16 : 8;

		if (!me.hakkyou && me.life < me.maxlife / 2) {
			playSound(SoundData.hakkyou);
			me.hakkyou = true;
		}

		if (me.frame < 24) {
			me.p = vrs.p.add(new vec(gamewidth / 2, gameheight / 2).sub(vrs.p).mlt(me.frame / 24));
		} else {
			if (me.frame % (interval * 2) == 0) { Bullets.push(...remodel([bullet_model], ["app", "laser", "r", 2, "p", me.p, "colourful", me.frame, "v", new vec(6, 0), "aim", player.p, "rot", 2 * Math.PI / 32, "f", (me) => { if (me.v.length < 24) { me.v = me.v.mlt(1.1); } }, "arrow", 60, "ex", 16, me.p])); }
			if (me.frame % interval == 0) { Bullets.push(...remodel([bullet_model], ["r", 6, "p", me.p, "colourful", me.frame, "v", new vec(6, 0), "rot", 2 * Math.PI * me.frame / 144, "ex", 32, me.p])); }
			if (me.frame % interval == interval / 2) { Bullets.push(...remodel([bullet_model], ["r", 6, "p", me.p, "colourful", me.frame, "v", new vec(3, 0), "rot", 2 * Math.PI / 64 + 2 * Math.PI * me.frame / 144, "ex", 16, me.p])); }
		}

		me.frame++;

		if (me.life <= 0) {
			scene0.score += me.maxlife ** 2 + player.life * 10000;
			Bullets = [];
			playSound(SoundData.KO);

			scene0.storyMode = true;
		}
	}
};


EnemiesData.fructose_0 = {
	p: new vec(gamewidth / 2, gameheight / 2), life: 100, maxlife: 100, frame: 0, r: 48, app: null,
	Update: (me) => {

		if (me.frame < 24) {
			me.p = vrs.p.add(new vec(gamewidth - me.r, gameheight - me.r).sub(vrs.p).mlt(me.frame / 24));
		} else {
			let f = me.frame % 720;

			if (0 <= f && f < 180) { me.p = linearMove(f, 180, new vec(gamewidth - me.r, gameheight - me.r), new vec(gamewidth - me.r, me.r)); }
			if (180 <= f && f < 360) { me.p = linearMove(f - 180, 180, new vec(gamewidth - me.r, me.r), new vec(me.r, me.r)); }
			if (360 <= f && f < 540) { me.p = linearMove(f - 360, 180, new vec(me.r, me.r), new vec(me.r, gameheight - me.r)); }
			if (540 <= f && f < 720) { me.p = linearMove(f - 540, 180, new vec(me.r, gameheight - me.r), new vec(gamewidth - me.r, gameheight - me.r)); }


			if (me.frame % 16 == 0) {
				let r = me.frame % 32 == 0 ? 1 : 0;

				Bullets.push(...remodel([bullet_model], [
					"p", me.p,
					"colourful", me.frame,
					"v", new vec(12, 0),
					"aim", player.p,
					"frame", 0,
					"f", (me) => {
						me.frame++;
						nextBullets.push(...remodel([bullet_model], [
							"r", 4,
							"app", "laser",
							"p", me.p,
							"colour", me.colour,
							"v", me.v,
							"wait", "frame", 1, (me) => { me.life = 0; },
							"cross", 30,
							"rev", 2 * Math.PI / 72 * me.frame, me.p.add(me.v)
						]));
					},
					"rot", 2 * Math.PI / 64 * r,
					"ex", 48, me.p
				]));
			}
		}

		me.frame++;

		if (me.life <= 0) {
			nextEnemies.push({ ...EnemiesData["fructose_1"] });
			Bullets = [];
			vrs.p = me.p;
			scene0.score += me.maxlife ** 2;
			playSound(SoundData.KO);
		}
	}
};

EnemiesData.fructose_1 = {
	p: new vec(gamewidth / 2, gameheight / 2), life: 100, maxlife: 100, frame: 0, r: 48, app: null,
	Update: (me) => {

		if (me.frame < 24) {
			me.p = vrs.p.add(new vec(gamewidth / 2, gameheight / 2).sub(vrs.p).mlt(me.frame / 24));
		} else {
			if (me.frame % 12 == 0) {
				Bullets.push(...remodel([bullet_model], ["type", "neutral", "p", me.p,
					"wait", "frame", 12, (me0) => {
						me0.life = 0;
						nextBullets.push(...remodel([bullet_model], ["colourful", me.frame, "p", me0.p, "v", new vec(6, 0), "ex", 32, me0.p]));
					}, "f", (me0) => {
						me0.v = player.p.sub(me0.p).mlt(1 / 3);
						let b = [];
						b.push(...remodel([bullet_model], ["type", "neutral", "p", me0.p.add(me0.v), "v", new vec(1, 0), "cross", 60 - me0.frame * 4, "wait", "frame", 0, (me1) => { me1.life = 0; }]));
						b.push(...remodel([bullet_model], ["type", "neutral", "p", me0.p.add(me0.v), "v", new vec(1, 0), "circle", 240 - me0.frame * 16, "wait", "frame", 0, (me1) => { me1.life = 0; }]));
						b.push(...remodel([bullet_model], ["type", "neutral", "p", me0.p.add(me0.v).add(new vec(120 - me0.frame * 8, 0)), "v", new vec(1, 0), "laser", 30 - me0.frame, "ex", 4, me0.p.add(me0.v), "wait", "frame", 0, (me1) => { me1.life = 0; }]));
						Bullets.push(...remodel(b, ["rev", 2 * Math.PI * me.frame / 144, me0.p]));
					}]));
			}
		}

		me.frame++;

		if (me.life <= 0) {
			nextEnemies.push({ ...EnemiesData["fructose_2"] });
			Bullets = [];
			vrs.p = me.p;
			scene0.score += me.maxlife ** 2;
			playSound(SoundData.KO);
		}
	}
};


EnemiesData.fructose_2 = {
	p: new vec(gamewidth / 2, gameheight / 2), life: 100, maxlife: 100, frame: 0, r: 48, app: null, from: new vec(gamewidth / 2, gameheight / 2), to: new vec(0, 0),
	Update: (me) => {

		if (me.frame < 24) {
			me.p = vrs.p.add(new vec(gamewidth / 2, gameheight / 2).sub(vrs.p).mlt(me.frame / 24));
		} else {
			me.p = linearMove((me.frame - 25) % 48, 48, me.from, me.to, x => x ** 2);

			if ((me.frame - 24) % 48 == 0) {
				me.to = new vec(gamewidth / 2, gameheight / 2).add(new vec(gamewidth / 4, gameheight / 4).mlt(Math.random() * 2 - 1));
				me.from = me.p;
			}

			if ((me.frame - 24) % 24 == 0) {
				for (let i = 1; i < 5; i++) {
					Bullets.push(...remodel([bullet_model], [
						"colourful", me.frame,
						"p", me.p,
						"v", new vec(24 / i, 0),
						"aim", player.p,
						"f", (me0) => {
							if (me0.p.sub(player.p).length < 240) {
								me0.life = 0;
								nextBullets.push(...remodel([bullet_model], ["p", me0.p, "v", new vec(12, 0), "frame", 0, "f", (me1) => {
									me1.frame++;
									nextBullets.push(...remodel([bullet_model], ["app", "laser", "r", 4, "colour", me0.colour, "p", me1.p.add(me1.v), "v", new vec(0.1, 0), "rot", me1.frame / 12, "cross", 20, "delete", 1]));
								}, "ex", 12, me0.p]));
							}

							if (me0.frame < 12) {
								me0.v = player.p.sub(me0.p).nor().mlt(me0.v.length)
							}
						},
						"frame", 0,
						"f", (me0) => { me0.frame++; nextBullets.push(...remodel([bullet_model], ["app", "laser", "r", 8, "colour", me0.colour, "p", me0.p.add(me0.v), "v", new vec(0.1, 0), "rot", me0.frame / 12, "cross", 40, "delete", 1])); },
						//"nway", 3, Math.PI / 12, me.p,
					]));
				}
			}
		}

		me.frame++;

		if (me.life <= 0) {
			nextEnemies.push({ ...EnemiesData["fructose_5"] });
			Bullets = [];
			vrs.p = me.p;
			scene0.score += me.maxlife ** 2;
			playSound(SoundData.KO);
		}
	}
};


EnemiesData.fructose_5 = {
	p: new vec(gamewidth / 2, gameheight / 2), life: 500, maxlife: 500, frame: 0, r: 48, app: null, muteki: true,
	Update: (me) => {

		if (me.frame < 24) {
			me.p = vrs.p.add(new vec(gamewidth / 2, gameheight / 2).sub(vrs.p).mlt(me.frame / 24));
		} else {
			for (let i = 0; i < 4; i++) {
				Bullets.push(...remodel([bullet_model], [
					"type", "neutral",
					"p", new vec(Math.random() * gamewidth, Math.random() * gameheight),
					"f", (me0) => { nextBullets.push(...remodel([bullet_model], ["r", 2, "type", "neutral", "p", me0.p, "cross", (me0.frame / 2) ** 2, "delete", 1])); },
					"wait", "frame", 12, (me0) => { me0.life = 0; nextBullets.push(...remodel([bullet_model], ["r", 2, "colourful", me.frame + me0.p.x * me0.p.y, "p", me0.p, "cross", 36, "delete", 6])); }
				]));
			}
		}

		me.frame++;
		me.life--;

		if (me.life <= 0) {
			Bullets = [];
			vrs.p = me.p;
			scene0.score += me.maxlife ** 2 + player.life * 10000;
			playSound(SoundData.KO);

			scene0.storyMode = true;
		}
	}
};