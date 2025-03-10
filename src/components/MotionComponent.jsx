import { motion } from 'framer-motion';

export default function MotionComponent({
    motionKey, 
    x1=0, x2=0, x3=0,
    y1=0, y2=0, y3=0,
    scale1=1, scale2=1, scale3=1,
    opacity1=0, opacity2=1, opacity3=0,
    duration=0.5, 
    animation="easeInOut",
    style = '',
    children
}) {
    return (
        <motion.div // replace {component} with the component you want to animate, e.g. div, img,
            layout
            key={motionKey}
            initial={{ opacity: opacity1, x: x1, y: y1, scale: scale1 }}
            animate={{ opacity: opacity2, x: x2, y: y2, scale: scale2 }}
            exit={{ opacity: opacity3, x: x3, y: y3, scale: scale3 }}
            transition={{ duration: duration, ease: animation }}
            className={style}
        >
            {children}
        </motion.div>
    )
}