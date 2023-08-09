export const transparentize = (hexColor: string, opacity: number): string => {
    if (opacity < 0 || opacity > 1 || !hexColor.match(/^#[a-fA-F0-9]{6}$/)) return hexColor;
    return hexColor + Math.round(255 * opacity).toString(16);
};
