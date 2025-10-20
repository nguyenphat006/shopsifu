'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useState, useEffect, memo } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { banners } from './landing-Mockdata';

const Particles = memo(function Particles({ className = "" }: { className?: string }) {
	return (
		<div className={cn("absolute inset-0 pointer-events-none", className)}>
			{[...Array(20)].map((_, i) => (
				<motion.span
					key={i}
					className="absolute block w-1 h-1 bg-white/30 rounded-full"
					style={{
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
					}}
					animate={{
						scale: [0.5, 1, 0.5],
						opacity: [0.3, 0.8, 0.3],
						y: [0, -30, 0],
					}}
					transition={{
						duration: Math.random() * 3 + 2,
						repeat: Infinity,
						ease: "easeInOut",
						delay: Math.random() * 2,
					}}
				/>
			))}
		</div>
	);
});

function BannerSectionComponent() {
	const [currentBanner, setCurrentBanner] = useState(0);
	const [isAutoplay, setIsAutoplay] = useState(true);
	const [direction, setDirection] = useState(0);

	useEffect(() => {
		if (!isAutoplay) return;
		const timer = setInterval(() => {
			setDirection(1);
			setCurrentBanner((prev) => (prev + 1) % banners.length);
		}, 5000);
		return () => clearInterval(timer);
	}, [isAutoplay]);

	const slideVariants: Variants = {
		enter: (direction: number) => ({
			y: direction > 0 ? '100%' : '-100%',
			opacity: 0,
			scale: 0.9,
			rotateX: direction > 0 ? 15 : -15,
		}),
		center: {
			zIndex: 1,
			y: 0,
			opacity: 1,
			scale: 1,
			rotateX: 0,
		},
		exit: (direction: number) => ({
			zIndex: 0,
			y: direction < 0 ? '100%' : '-100%',
			opacity: 0,
			scale: 0.9,
			rotateX: direction < 0 ? 15 : -15,
		}),
	};

	const titleVariants: Variants = {
		hidden: { opacity: 0, scale: 1.02 },
		visible: (i: number) => ({
			opacity: 1,
			scale: 1,
			transition: {
				staggerChildren: 0.03,
				delayChildren: 0.02 * i,
				ease: [0.2, 0.8, 0.2, 1],
				duration: 0.4,
			},
		}),
		exit: {
			opacity: 0,
			scale: 0.98,
			transition: {
				staggerChildren: 0.02,
				staggerDirection: -1,
				ease: [0.6, 0, 0.4, 1],
				duration: 0.3,
			},
		},
	};

	const letterVariants: Variants = {
		hidden: { opacity: 0, y: 10, rotateX: -60, scale: 0.9 },
		visible: {
			opacity: 1,
			y: 0,
			rotateX: 0,
			scale: 1,
			textShadow: '1px 1px 0 rgba(0,0,0,0.5), 2px 4px 6px rgba(0,0,0,0.3)',
			transition: {
				type: "spring",
				damping: 15,
				stiffness: 120,
				mass: 0.2,
				ease: [0.2, 0.8, 0.2, 1],
			},
		},
		exit: {
			opacity: 0,
			y: -10,
			rotateX: 60,
			scale: 0.9,
			transition: {
				type: "spring",
				damping: 15,
				stiffness: 120,
				mass: 0.2,
				ease: [0.6, 0, 0.4, 1],
			},
		},
	};

	return (
		<div
			className="relative h-[150px] md:h-[175px] overflow-hidden rounded-xl group perspective-[2000px] hover:shadow-2xl hover:shadow-black/20 transition-all duration-500"
		>
			<motion.div
				initial={{ scale: 1 }}
				animate={{ scale: [1, 1.02, 1] }}
				className="absolute inset-0"
			>
				<AnimatePresence
					initial={false}
					mode="popLayout"
					custom={direction}
					onExitComplete={() => setIsAutoplay(true)}
				>
					{banners.map((banner, index) => (
						index === currentBanner && (
							<motion.div
								key={banner.title}
								className="absolute inset-0"
								custom={direction}
								variants={slideVariants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{
									y: { type: "spring", stiffness: 150, damping: 20, mass: 0.8 },
									opacity: { duration: 0.6 },
									scale: { duration: 0.6 },
									rotateX: { type: "spring", stiffness: 100, damping: 12, mass: 0.8 },
								}}
								style={{ perspective: "2000px", transformStyle: 'preserve-3d' }}
							>
								<Particles className="opacity-50" />
								<motion.div className="absolute inset-0 overflow-hidden">
									<Image
										src={banner.image}
										alt={banner.title}
										fill
										className="object-cover object-center will-change-transform"
										priority={index === 0}
										sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1280px"
									/>
								</motion.div>
								<motion.div
									initial={{ opacity: 0.4 }}
									animate={{ opacity: [0.4, 0.5, 0.4] }}
									transition={{ repeat: Infinity, duration: 20, ease: "easeInOut", times: [0, 0.5, 1] }}
									className={cn(
										"absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent",
										`${banner.gradient} after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/20 after:via-transparent after:to-black/10`
									)}
								/>
								<div className="absolute inset-0 flex items-center">
									<div className="w-full md:w-3/5 px-6 md:px-10 space-y-2.5">
										<motion.div
											variants={titleVariants}
											initial="hidden"
											animate="visible"
											exit="exit"
											custom={0}
											className="text-2xl md:text-3xl font-bold text-white tracking-tight overflow-hidden perspective-[1000px] will-change-transform"
										>
											{Array.from(banner.title).map((char, i) => (
												<motion.span
													key={i}
													variants={letterVariants}
													style={{ display: 'inline-block', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
													className={cn("relative", char === ' ' ? 'mr-1.5' : '')}
												>
													{char}
												</motion.span>
											))}
										</motion.div>
										<motion.div
											variants={titleVariants}
											initial="hidden"
											animate="visible"
											exit="exit"
											custom={1}
											className="text-sm text-white/90 font-medium max-w-[280px] md:max-w-[320px] overflow-hidden perspective-[1000px] will-change-transform"
										>
											{Array.from(banner.description).map((char, i) => (
												<motion.span
													key={i}
													variants={letterVariants}
													style={{ display: 'inline-block', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
													className={char === ' ' ? 'mr-0.5' : ''}
												>
													{char}
												</motion.span>
											))}
										</motion.div>
										<motion.div
											initial={{ opacity: 0, y: 15, scale: 0.9 }}
											animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.5, duration: 0.8, ease: [0.25, 1, 0.5, 1] } }}
											exit={{ opacity: 0, y: -15, scale: 0.9, transition: { duration: 0.4, ease: [0.6, 0, 0.4, 1] } }}
										>
											<Button
												asChild
												size="sm"
												variant="destructive"
												className="relative rounded-md bg-gradient-to-r from-red-500 via-red-600 to-red-500 hover:from-red-600 hover:via-red-500 hover:to-red-600 text-white hover:shadow-xl hover:shadow-red-500/30 hover:scale-105 transition-all duration-500 overflow-hidden group/btn"
											>
												<Link href={banner.link} className="inline-flex items-center gap-1.5">
													<span className="relative z-10 font-medium">Khám phá</span>
													<motion.span
														className="relative z-10"
														animate={{ x: [0, 5, 0], opacity: [1, 0.8, 1], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } }}
													>
														<ArrowRight className="h-3.5 w-3.5" />
													</motion.span>
													<motion.div
														className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-400/40 to-red-600/0"
														animate={{ x: ['-200%', '200%'], transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
													/>
												</Link>
											</Button>
										</motion.div>
									</div>
								</div>
							</motion.div>
						)
					))}
				</AnimatePresence>
				<Particles className="opacity-50" />
			</motion.div>
		</div>
	);
}

export const BannerSection = memo(BannerSectionComponent);