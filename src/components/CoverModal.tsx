import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface CoverModalProps {
  onStart: () => void;
  isVisible: boolean;
}

export function CoverModal({ onStart, isVisible }: CoverModalProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ backdropFilter: "blur(8px)" }}
          animate={{ backdropFilter: "blur(8px)" }}
          exit={{ backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative rounded-lg bg-white/10 p-8 shadow-xl backdrop-blur-lg dark:bg-black/30 font-serif"
          >
            <div className="max-w-md text-center">
              <h2 className="mb-6 text-3xl font-bold text-white font-serif">
                First Draft App
              </h2>
              <ul className="mb-8 space-y-4 text-lg text-gray-200 text-left font-serif">
                <li>
                  ✍️ &ldquo;First draft mode&rdquo; disables the delete button
                </li>
                <li>⏱️ Focus timer for productive sprints</li>
                <li>📋 Your draft is saved locally</li>
              </ul>
              <Button
                onClick={onStart}
                className="w-full bg-white/20 text-lg font-semibold text-white hover:bg-white/30 font-serif"
              >
                Start Writing
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
