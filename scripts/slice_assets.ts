import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function slice() {
  const outDir = path.resolve('public/assets/sliced');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const menuSheet = path.resolve('public/assets/aistudio/menu_assets_sheet_transparent_421f13ce.png');
  const gameSheet = path.resolve('public/assets/aistudio/game_asset_sheet_rgba_f5e4e4e5.png');

  const metaMenu = await sharp(menuSheet).metadata();
  const metaGame = await sharp(gameSheet).metadata();

  console.log(`Menu sheet: ${metaMenu.width} x ${metaMenu.height}`);
  console.log(`Game sheet: ${metaGame.width} x ${metaGame.height}`);

  const mW = metaMenu.width || 1672;
  const mH = metaMenu.height || 941;
  const gW = metaGame.width || 1672;
  const gH = metaGame.height || 941;

  async function safeExtract(src: string, maxW: number, maxH: number, name: string, rect: { left: number; top: number; width: number; height: number }) {
    let left = Math.max(0, rect.left);
    let top = Math.max(0, rect.top);
    if (left >= maxW || top >= maxH) return;
    let width = Math.min(rect.width, maxW - left);
    let height = Math.min(rect.height, maxH - top);
    if (width <= 0 || height <= 0) return;

    try {
      const dest = path.join(outDir, `${name}.png`);
      await sharp(src)
        .extract({ left, top, width, height })
        .toFile(dest);
      console.log(`Extracted: ${name}.png (${width}x${height})`);
    } catch (e: any) {
      console.error(`Error on ${name}:`, e.message);
    }
  }

  // Menu crops
  const menuCrops: Record<string, { left: number; top: number; width: number; height: number }> = {
    tree_oak_large: { left: 5, top: 15, width: 320, height: 340 },
    tree_medium: { left: 340, top: 75, width: 180, height: 280 },
    tree_cherry_pink: { left: 535, top: 25, width: 225, height: 335 },
    tree_autumn_gold: { left: 775, top: 30, width: 220, height: 330 },
    tree_small: { left: 1005, top: 110, width: 140, height: 245 },
    rocky_mountain: { left: 1150, top: 50, width: 190, height: 135 },
    stone_well: { left: 1350, top: 25, width: 155, height: 195 },
    windmill_wood: { left: 1500, top: 15, width: 165, height: 225 },

    cottage_house: { left: 1060, top: 310, width: 335, height: 295 },
    barn_house: { left: 1400, top: 390, width: 220, height: 215 },
    market_stall: { left: 690, top: 385, width: 165, height: 170 },
    signpost_wood: { left: 955, top: 420, width: 95, height: 210 },
    street_lamp: { left: 960, top: 425, width: 75, height: 200 },
    notice_board_stand: { left: 695, top: 385, width: 155, height: 170 },

    btn_settings: { left: 595, top: 705, width: 85, height: 85 },
    btn_gift: { left: 690, top: 705, width: 85, height: 85 },
    btn_backpack: { left: 785, top: 705, width: 85, height: 85 },
    btn_book: { left: 880, top: 705, width: 85, height: 85 },
    btn_map: { left: 975, top: 705, width: 85, height: 85 },
    btn_help: { left: 1070, top: 705, width: 85, height: 85 },
    btn_home: { left: 1165, top: 705, width: 85, height: 85 },

    panel_notice_board: { left: 15, top: 680, width: 320, height: 185 },
    panel_speech_bubble: { left: 350, top: 685, width: 235, height: 175 },
    panel_scenic_frame: { left: 1240, top: 695, width: 230, height: 175 },
    panel_wood_card: { left: 1475, top: 695, width: 185, height: 175 },

    badge_check: { left: 10, top: 870, width: 80, height: 65 },
    badge_close: { left: 95, top: 870, width: 80, height: 65 },
    badge_warning: { left: 185, top: 870, width: 80, height: 65 },
    badge_info: { left: 270, top: 870, width: 80, height: 65 },
    badge_star_gold: { left: 360, top: 875, width: 70, height: 60 },
    badge_heart: { left: 435, top: 875, width: 70, height: 60 },
    badge_coin_gold: { left: 515, top: 875, width: 70, height: 60 },
    badge_gem_green: { left: 595, top: 875, width: 70, height: 60 },
    badge_gem_blue: { left: 670, top: 875, width: 75, height: 60 },

    bush_dense_green: { left: 25, top: 575, width: 140, height: 95 },
    bush_rose_pink: { left: 230, top: 580, width: 115, height: 90 },
  };

  // Game crops
  const gameCrops: Record<string, { left: number; top: number; width: number; height: number }> = {
    bakery_cottage: { left: 15, top: 20, width: 440, height: 360 },
    windmill_tall: { left: 470, top: 15, width: 215, height: 360 },
    mosque_palace: { left: 705, top: 20, width: 330, height: 355 },

    garden_pond_bridge: { left: 440, top: 650, width: 495, height: 185 },
    wooden_bench: { left: 590, top: 450, width: 135, height: 105 },
    stone_well_red: { left: 460, top: 385, width: 120, height: 175 },
    wooden_cart_flowers: { left: 1045, top: 560, width: 165, height: 115 },
    scroll_treasure_map: { left: 1530, top: 855, width: 130, height: 80 },

    badge_trophy_gold: { left: 1590, top: 515, width: 75, height: 80 },
    badge_gift_box: { left: 1520, top: 520, width: 70, height: 75 },
    badge_compass_map: { left: 1370, top: 520, width: 70, height: 75 },
    badge_golden_coin_banner: { left: 1285, top: 405, width: 185, height: 50 },
    badge_diamond_banner: { left: 1485, top: 405, width: 150, height: 50 },
    btn_play_circle: { left: 1445, top: 715, width: 65, height: 65 },
    btn_pause_circle: { left: 1520, top: 715, width: 65, height: 65 },
    btn_home_circle: { left: 1590, top: 715, width: 65, height: 65 },

    banner_ribbon_gold: { left: 1320, top: 910, width: 100, height: 40 },
    banner_ribbon_red: { left: 1235, top: 910, width: 95, height: 40 },
    banner_ribbon_blue: { left: 1115, top: 910, width: 115, height: 40 },
  };

  for (const [name, rect] of Object.entries(menuCrops)) {
    await safeExtract(menuSheet, mW, mH, name, rect);
  }

  for (const [name, rect] of Object.entries(gameCrops)) {
    await safeExtract(gameSheet, gW, gH, name, rect);
  }

  console.log('Finished safe extraction.');
}

slice().catch(console.error);
