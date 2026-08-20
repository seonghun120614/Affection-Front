"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SignupPage } from "@/pages/SignupPage";
import { SignupContractPage } from "@/pages/SignupContract";

export default function Signup() {
    const [isAgreed, setIsAgreed] = useState(false);

    return (
        <AnimatePresence mode="wait">
            {!isAgreed ? (
                <motion.div
                    key="contract"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="w-full"
                >
                    <SignupContractPage onAgree={() => setIsAgreed(true)} />
                </motion.div>
            ) : (
                <motion.div
                    key="signup-form"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="w-full"
                >
                    <SignupPage />
                </motion.div>
            )}
        </AnimatePresence>
    );
}