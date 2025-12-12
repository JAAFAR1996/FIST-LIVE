import React from 'react';
import { motion } from 'framer-motion';

// --- Types ---
export type ShrimpType = 'LARVA' | 'TEEN' | 'BOSS' | 'WHALE' | 'GOLDEN' | 'CLEANER' | 'GLITCH' | 'CUSTOM';

export interface ShrimpPart {
    src: string;
    alt: string;
    className?: string;
}

export interface ShrimpConfig {
    type: ShrimpType;
    parts: {
        head: ShrimpPart;
        body: ShrimpPart;
        tail?: ShrimpPart;
        armLeft?: ShrimpPart;
        armRight?: ShrimpPart;
        antennaLeft?: ShrimpPart;
        antennaRight?: ShrimpPart;
    };
    face: {
        eyes: ShrimpPart;
        mouth?: ShrimpPart;
    };
    accessories?: {
        cap?: boolean;
        sunglasses?: boolean;
        chainSmall?: boolean;
        chainLarge?: boolean;
        throne?: boolean;
        crown?: boolean;
        squeegee?: boolean;
        bucket?: boolean;
    };
    effects?: {
        sparkles?: boolean;
        tears?: boolean;
        blush?: boolean;
        motionLines?: boolean;
        glitch?: boolean;
        glow?: boolean;
    };
}

export interface ShrimpCharacterProps {
    config: ShrimpConfig;
    size?: 'small' | 'medium' | 'large' | 'xl';
    className?: string;
    onClick?: () => void;
    animate?: boolean;
}

// --- Asset Helper ---
const ASSET_BASE = '/shrimp_assets';
const part = (path: string, alt: string) => ({ src: `${ASSET_BASE}/${path}`, alt });

// --- Configurations ---
export const LARVA_CONFIG: ShrimpConfig = {
    type: 'LARVA',
    parts: {
        head: part('body_parts/head_blank.png', 'Head'),
        body: part('body_parts/body_segmented.png', 'Body'),
        tail: part('body_parts/tail_fan.png', 'Tail'),
        antennaLeft: part('body_parts/antenna_left.png', 'Antenna L'),
        antennaRight: part('body_parts/antenna_right.png', 'Antenna R'),
    },
    face: {
        eyes: part('faces/eyes/eyes_sad_lift.png', 'Sad Eyes'), // Typo fix: lift -> left
        mouth: part('faces/mouths/mouth_smile.png', 'Small Mouth'), // Maybe flip for sad?
    },
    effects: {
        tears: true,
    }
};

export const TEEN_CONFIG: ShrimpConfig = {
    type: 'TEEN',
    parts: {
        head: part('body_parts/head_blank.png', 'Head'),
        body: part('body_parts/body_segmented.png', 'Body'),
        tail: part('body_parts/tail_fan.png', 'Tail'),
        armLeft: part('body_parts/arm_left.png', 'Arm L'),
        armRight: part('body_parts/arm_right.png', 'Arm R'),
        antennaLeft: part('body_parts/antenna_left.png', 'Antenna L'),
        antennaRight: part('body_parts/antenna_right.png', 'Antenna R'),
    },
    face: {
        eyes: part('faces/eyes/eyes_normal_lift.png', 'Eyes'), // Typo fix
        mouth: part('faces/mouths/mouth_smile.png', 'Smile'),
    },
    accessories: {
        cap: true,
        chainSmall: true,
    }
};

export const BOSS_CONFIG: ShrimpConfig = {
    type: 'BOSS',
    parts: {
        head: part('body_parts/head_blank.png', 'Head'),
        body: part('body_parts/body_segmented.png', 'Body'),
        tail: part('body_parts/tail_fan.png', 'Tail'),
        armLeft: part('body_parts/arm_left.png', 'Arm L'),
        armRight: part('body_parts/arm_right.png', 'Arm R'),
        antennaLeft: part('body_parts/antenna_left.png', 'Antenna L'),
        antennaRight: part('body_parts/antenna_right.png', 'Antenna R'),
    },
    face: {
        eyes: part('faces/eyes/eyes_cool.png', 'Cool Eyes'),
        mouth: part('faces/mouths/mouth_smile.png', 'Grin'),
    },
    accessories: {
        crown: true,
        chainLarge: true,
        throne: true,
    }
};

export const GOLDEN_CONFIG: ShrimpConfig = {
    type: 'GOLDEN',
    parts: {
        head: part('body_parts/head_blank.png', 'Head'),
        body: part('body_parts/body_segmented.png', 'Body'),
        tail: part('body_parts/tail_fan.png', 'Tail'),
        armLeft: part('body_parts/arm_left.png', 'Arm L'),
        armRight: part('body_parts/arm_right.png', 'Arm R'),
    },
    face: {
        eyes: part('faces/eyes/eyes_dollar.png', 'Dollar Eyes'),
        mouth: part('faces/mouths/mouth_smile.png', 'Rich Smile'),
    },
    effects: {
        sparkles: true,
        glow: true,
    }
};

export const CLEANER_CONFIG: ShrimpConfig = {
    type: 'CLEANER',
    parts: {
        head: part('body_parts/head_blank.png', 'Head'),
        body: part('body_parts/body_segmented.png', 'Body'),
        tail: part('body_parts/tail_fan.png', 'Tail'),
        armLeft: part('body_parts/arm_left.png', 'Arm L'),
        armRight: part('body_parts/arm_right.png', 'Arm R'),
    },
    face: {
        eyes: part('faces/eyes/eyes_normal_lift.png', 'Focused Eyes'),
    },
    accessories: {
        squeegee: true,
        bucket: true,
    }
};


// --- Component ---
export const ShrimpCharacter: React.FC<ShrimpCharacterProps> = ({
    config,
    size = 'medium',
    className = '',
    onClick,
    animate = true
}) => {

    const sizeClasses = {
        small: 'w-24 h-24',
        medium: 'w-32 h-32',
        large: 'w-48 h-48',
        xl: 'w-64 h-64',
    };

    const bounce = animate ? {
        y: [0, -5, 0],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const }
    } : undefined;

    return (
        <motion.div
            className={`relative inline-block ${sizeClasses[size]} ${className}`}
            onClick={onClick}
            animate={bounce}
            whileHover={onClick ? { scale: 1.1 } : {}}
            style={{ filter: config.effects?.glow ? 'drop-shadow(0 0 10px gold)' : undefined }}
        >
            {/* Helper to render parts */}
            <div className="relative w-full h-full">
                {/* Throne (Behind) */}
                {config.accessories?.throne && (
                    <img src={`${ASSET_BASE}/accessories/throne.png`} alt="Throne" className="absolute top-10 left-0 w-full h-full object-contain -z-10" />
                )}

                {/* Base Body Parts */}
                {config.parts.tail && <img src={config.parts.tail.src} alt="Tail" className="absolute bottom-0 right-2 w-1/2 object-contain" />}
                <img src={config.parts.body.src} alt="Body" className="absolute bottom-4 left-4 w-2/3 object-contain" />
                <img src={config.parts.head.src} alt="Head" className="absolute top-0 left-0 w-2/3 object-contain z-10" />

                {/* Limbs & Antenna */}
                {config.parts.armLeft && <img src={config.parts.armLeft.src} alt="Arm L" className="absolute top-1/2 -left-2 w-1/3 object-contain z-20" />}
                {config.parts.armRight && <img src={config.parts.armRight.src} alt="Arm R" className="absolute top-1/2 right-4 w-1/3 object-contain z-0" />}
                {config.parts.antennaLeft && <img src={config.parts.antennaLeft.src} alt="Antena L" className="absolute -top-4 left-0 w-1/3 object-contain z-0" />}
                {config.parts.antennaRight && <img src={config.parts.antennaRight.src} alt="Antena R" className="absolute -top-4 right-10 w-1/3 object-contain z-0" />}

                {/* Face */}
                <img src={config.face.eyes.src} alt="Eyes" className="absolute top-8 left-6 w-1/3 object-contain z-20" />
                {config.face.mouth && <img src={config.face.mouth.src} alt="Mouth" className="absolute top-14 left-8 w-1/4 object-contain z-20" />}

                {/* Accessories */}
                {config.accessories?.crown && <img src={`${ASSET_BASE}/accessories/crown.png`} alt="Crown" className="absolute -top-6 left-2 w-1/2 object-contain z-30" />}
                {config.accessories?.cap && <img src={`${ASSET_BASE}/accessories/cap.png`} alt="Cap" className="absolute -top-4 left-2 w-1/2 object-contain z-30" />}
                {config.accessories?.sunglasses && <img src={`${ASSET_BASE}/accessories/sunglasses.png`} alt="Glasses" className="absolute top-8 left-6 w-1/3 object-contain z-30" />}
                {config.accessories?.chainLarge && <img src={`${ASSET_BASE}/accessories/chain_large.png`} alt="Chain" className="absolute top-20 left-4 w-1/2 object-contain z-20" />}
                {config.accessories?.chainSmall && <img src={`${ASSET_BASE}/accessories/chain_small.png`} alt="Chain" className="absolute top-20 left-4 w-1/2 object-contain z-20" />}

                {config.accessories?.squeegee && <img src={`${ASSET_BASE}/accessories/squeegee.png`} alt="Squeegee" className="absolute top-0 -left-8 w-1/2 object-contain z-40 transform -rotate-12" />}

                {/* Effects */}
                {config.effects?.tears && (
                    <motion.img
                        src={`${ASSET_BASE}/effects/tear_25px.png`}
                        alt="Tear"
                        className="absolute top-12 left-6 w-4"
                        animate={{ y: [0, 20], opacity: [1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                )}
                {config.effects?.sparkles && (
                    <motion.img
                        src={`${ASSET_BASE}/effects/sparkles.png`}
                        alt="Sparkles"
                        className="absolute -top-10 -right-10 w-full h-full object-contain z-50"
                        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
            </div>
        </motion.div>
    );
};
