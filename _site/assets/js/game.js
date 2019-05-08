var rpApp = rpApp || {};

rpApp.resizeGameWrapper = function() {
    rpApp.window.setTimeout(function() {
        if (rpApp.isMobileDevice && rpApp.window.innerWidth > rpApp.window.innerHeight) {
            rpApp.gameHeight = rpApp.window.innerHeight;
            rpApp.gameWidth = 16 * rpApp.gameHeight / 9;

            $('#rpGameWrapper').css({
                width: rpApp.gameWidth + 'px',
                height: rpApp.gameHeight + 'px',
                margin: '0 auto'
            });
        }
    }, 200);
};

rpApp.launchGame = function() {
    document.getElementById('rpGame').classList.add('active');

    rpApp.resizeGameWrapper();

    rpApp.game = new Phaser.Game(rpApp.dimensions.width, rpApp.dimensions.height, Phaser.CANVAS, 'rpGame');
    rpApp.game.state.add('boot', rpApp.boot);
    rpApp.game.state.add('load', rpApp.load);
    rpApp.game.state.add('intro', rpApp.intro);

    for (var level in rpApp.levels) {
        if (level !== 'secret') {
            rpApp.game.state.add('title-' + level, rpApp.titles[level]);
            rpApp.game.state.add('level-' + level, rpApp.play.levels[level]);
        } else {
            rpApp.game.state.add(level, rpApp.secret);
        }
    }

    rpApp.game.state.add('ending', rpApp.ending);
    rpApp.game.state.start('boot');
};

rpGame.launchGame = rpApp.launchGame;

(function() {
    rpGame.window = window;
    rpApp.window = window;

    document.addEventListener('DOMContentLoaded', function(e) {
        var resizeTimeout,
            images = [],
            mp3 = [],
            ogg = [];

        if (rpApp.hasOwnProperty('preloadAssests')) {
            rpApp.preloadAssests.images.forEach(function(image, i) {
                images[i] = new Image();
                images[i].src = rpApp.assetsPath + image;
            });

            if (!rpGame.isMobileDevice) {
                rpApp.preloadAssests.mp3.forEach(function(audio, a) {
                    mp3[a] = new Audio();
                    mp3[a].src = rpApp.assetsPath + audio;
                });

                rpApp.preloadAssests.ogg.forEach(function(audio, a) {
                    ogg[a] = new Audio();
                    ogg[a].src = rpApp.assetsPath + audio;
                });
            }
        }

        rpGame.window.addEventListener('resize', function(e) {
            if (resizeTimeout) {
                rpGame.window.cancelAnimationFrame(resizeTimeout);
            }

            resizeTimeout = rpGame.window.requestAnimationFrame(function () {
                rpGame.resizeGameWrapper();
            });
        });

        document.getElementById('rpGameLaunch').addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('rpGameModal').classList.add('active');
            rpGame.launchGame();
        });
    });
})();
