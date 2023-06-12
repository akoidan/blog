---
title: "Best pracices for frontend development"
description: "Stop putting classes to html, css should be within its block"
date: "24 May 2022"
heroImage: "/connect-linode-longview-kubernetes-mysql-pod-graph.webp"
tags: 
 - patterns 
 - ecosystem
---

invert your way of doing typical frontend by following programming principles writtings your css code


This is my personal approach, that differs a lot from typical way people tends to be doing css


1. Clean HTML, no bootstrap-style components <div class="pd-2 shadow rounded bg-green"> that looks barely readable
2. Js code should NOT contain anything that can be fit into html. like text templates etc, only js logic
3. EMbrace the power of modern css tools that allows aggregating and inheriting styles. Move html classes into css relationships


do not do

				<!-- social.map((ele) => (
						<a
							class="w-8 h-8 flex scale-1 hover:scale-125 transition-[scale] justify-center"
							href={ele.link}
							target="_blank"
							rel="noreferrer noopener"
						>
							<span class="sr-only">{`Link to my ${
								ele.sr ??
								capitalizeString(
									ele.link.replace(/.+\/\/|www.|\..+/g, "")
								)
							} account`}</span>
							<Fragment set:html={ele.svg} />
						</a>
					)) -->
