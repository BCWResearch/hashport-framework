import { ComponentProps, MouseEvent, Suspense, lazy, useState } from 'react';
import type HashportWidget from './HashportWidget';

const Widget = lazy(() => import('./HashportWidget'));
const Dialog = lazy(() => import('@mui/material/Dialog'));

type HashportWidgetLoaderButtonProps = {
    widgetProps?: ComponentProps<typeof HashportWidget>;
    label?: React.ReactNode;
    suspenseFallback?: React.ReactNode;
} & Omit<ComponentProps<'button'>, 'children'>;

export const HashportWidgetLoaderButton = ({
    label = 'Hashport Widget',
    suspenseFallback = <p style={{ padding: '1rem 2rem' }}>Loading...</p>,
    widgetProps = {},
    onClick,
    ...props
}: HashportWidgetLoaderButtonProps) => {
    const [open, setOpen] = useState(false);

    const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
        setOpen(true);
        onClick?.(e);
    };

    const handleClose = () => {
        // TODO: make sure they can't close it while porting
        setOpen(false);
    };

    return (
        <>
            <button {...props} onClick={handleClick}>
                {label}
            </button>
            <Suspense fallback={null}>
                <Dialog
                    keepMounted
                    open={open}
                    PaperProps={{ sx: { borderRadius: 4 } }}
                    onClose={handleClose}
                >
                    {open && (
                        <Suspense fallback={suspenseFallback}>
                            <Widget {...widgetProps} />
                        </Suspense>
                    )}
                </Dialog>
            </Suspense>
        </>
    );
};
