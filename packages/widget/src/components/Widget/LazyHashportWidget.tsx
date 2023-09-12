import {
    ComponentProps,
    Dispatch,
    MouseEvent,
    SetStateAction,
    Suspense,
    lazy,
    useEffect,
    useState,
} from 'react';
import type { HashportProviders } from './HashportProviders';

const WidgetDialog = lazy(() => import('./WidgetDialog'));

const SuspenseFallback = ({
    setIsSuspended,
}: {
    setIsSuspended: Dispatch<SetStateAction<boolean>>;
}) => {
    useEffect(() => {
        setIsSuspended(true);
        return () => setIsSuspended(false);
    }, [setIsSuspended]);
    return <></>;
};

type LazyHashportWidgetProps = {
    label?: React.ReactNode;
    suspendedLabel?: React.ReactNode;
    widgetProps?: ComponentProps<typeof HashportProviders>;
} & Omit<ComponentProps<'button'>, 'children'>;

export const LazyHashportWidget = ({
    label = 'Hashport Widget',
    suspendedLabel = 'Loading...',
    widgetProps = {},
    onClick,
    ...props
}: LazyHashportWidgetProps) => {
    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);
    const [isSuspended, setIsSuspended] = useState(false);

    const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
        setShow(true);
        setOpen(true);
        onClick?.(e);
    };

    const handleClose = () => setOpen(false);

    return (
        <>
            <button {...props} onClick={handleClick}>
                {isSuspended ? suspendedLabel : label}
            </button>
            {show && (
                <Suspense fallback={<SuspenseFallback setIsSuspended={setIsSuspended} />}>
                    <WidgetDialog widgetProps={widgetProps} open={open} handleClose={handleClose} />
                </Suspense>
            )}
        </>
    );
};
