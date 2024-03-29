import { Slider as MuiSlider } from '@mui/base/Slider';
import Box from '@mui/material/Box';
import { SliderProps as MuiSliderProps } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

const THUMB_WIDTH = 10;
const SLIDER_HEIGHT = 5;
const ARROW_ICON = `url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-uqopch" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowForwardRoundedIcon"><path d="M5 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42.39.39 1.02.39 1.41 0l6.59-6.59c.39-.39.39-1.02 0-1.41l-6.58-6.6a.9959.9959 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41L16.17 11H5c-.55 0-1 .45-1 1s.45 1 1 1z"></path></svg>')`;

const SliderContainer = styled(Box)(({ theme: { palette, spacing } }) => ({
    display: 'flex',
    position: 'relative',
    padding: `${spacing(SLIDER_HEIGHT / 5)} ${spacing(THUMB_WIDTH / 2 + 1)}`,
    backgroundColor: palette.primary.light,
    borderRadius: spacing(4),
    transition: 'background-color 250ms ease',
}));

const StyledSlider = styled(MuiSlider)(({ theme }) => ({
    height: theme.spacing(SLIDER_HEIGHT),
    width: '100%',
    display: 'inline-block',
    position: 'relative',
    cursor: 'pointer',
    touchAction: 'none',
    opacity: 0.75,
    '&:hover, &:focus-within': {
        opacity: 1,
    },
    '&.Mui-disabled': {
        opacity: 0.25,
        pointerEvents: 'none',
    },
    '& .MuiSlider-thumb': {
        transition: 'left .5s ease',
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: theme.spacing(THUMB_WIDTH),
        height: '100%',
        borderRadius: theme.spacing(5),
        background: `${ARROW_ICON} center/35% no-repeat`,
        backgroundColor: theme.palette.text.primary,
        '&.Mui-active': {
            transition: 'unset',
        },
    },
}));

const SliderText = styled(Typography)(({ theme: { palette } }) => ({
    width: '90%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontWeight: 600,
    color: palette.text.primary,
}));

type SliderProps = Omit<MuiSliderProps, 'value'> & {
    onConfirm: () => Promise<void>;
    prompt?: string;
    isError?: boolean;
};
export const Slider = ({
    onConfirm,
    prompt = `Swipe to confirm`,
    isError,
    disabled,
    ...props
}: SliderProps) => {
    const [value, setValue] = useState(0);

    const handleChange = (e: Event, newValue: number | number[]) => {
        if (typeof newValue === `number`) {
            setValue(Math.min(100, newValue));
        }
    };

    const handleConfirm = async () => {
        if (value === 100) {
            await onConfirm();
        }
        setValue(0);
    };
    return (
        <SliderContainer
            sx={({ palette }) => ({
                ...(disabled ? { backgroundColor: palette.primary.dark } : {}),
                ...(isError ? { backgroundColor: palette.error.main } : {}),
            })}
        >
            <SliderText
                align="center"
                variant="caption"
                sx={{
                    opacity: disabled ? 0.5 : (100 - value) / 100,
                }}
            >
                {prompt}
            </SliderText>
            <StyledSlider
                disabled={disabled}
                defaultValue={0}
                value={value}
                aria-label="Confirm"
                onChangeCommitted={handleConfirm}
                onChange={handleChange}
                {...props}
            />
        </SliderContainer>
    );
};
