# DarcOS 🖥️

**Device Agnostic Runtime Compatible Operating System**

DarcOS is a next-generation operating system focused on true portability and determinism. Built with [WLP4P (Waterloo Language Plus Pointers Plus Procedures)](https://student.cs.uwaterloo.ca/~cs241/wlp4/), it embraces a minimal, analyzable core while enabling modern systems capabilities through disciplined procedures and memory semantics.

---

## ✨ What is DarcOS?

DarcOS represents a fundamental reimagining of what an operating system can be. We're building a system that prioritizes:

* **Transparency** in cost and behavior
* **Predictability** through deterministic execution
* **True portability** across diverse hardware platforms
* **Minimal surface area** with only essential services

---

## 🎯 Core Features

* **Deterministic Execution**: Predictable behavior and performance characteristics through WLP4P's strict semantics and controlled memory management.
* **Device Agnostic**: Runs identically across different hardware platforms without modification, enabling true portability and consistency.
* **Minimal Surface Area**: Small, analyzable kernel with only essential services, reducing complexity and attack surface.
* **Memory Safety**: Controlled pointer semantics and explicit memory management prevent common security vulnerabilities.
* **Runtime Compatibility**: Stable runtime surface that abstracts hardware differences while maintaining performance transparency.
* **Formal Verification**: Designed for formal reasoning and verification, enabling mathematical proofs of system properties.

---

## 🛠 Technical Specifications

### Language Foundation
* WLP4P (Waterloo Language Plus Pointers Plus Procedures)
* Strict subset of C++ for predictable compilation
* Controlled pointer semantics
* Explicit memory management

### Runtime Characteristics
* Device-agnostic runtime surface
* Deterministic execution model
* Minimal kernel footprint
* Hardware abstraction without performance hiding

---

## 🎨 Web UI Demo

This repository includes a **Canvas Demo** (`/demo`) showcasing DarcOS's interactive capabilities:

* **Interactive Bulletin Board**: Drag-and-drop paper notes with real-time updates
* **Multi-touch Support**: Pinch-to-zoom and two-finger panning for mobile devices
* **Dynamic Content**: Real-time data fetching and persistence
* **Responsive Design**: Works seamlessly across desktop, tablet, and mobile

The canvas demo serves as a proof-of-concept for DarcOS's user interface capabilities and demonstrates the system's commitment to responsive, intuitive interaction design.

---

## 💻 Development

This site is built with [Preact](https://preactjs.com/) and [Vite](https://vitejs.dev/).

### Scripts

* `npm run dev` → Start a dev server at [http://localhost:5173/](http://localhost:5173/)
* `npm run build` → Build for production into `dist/`
* `npm run preview` → Preview production build at [http://localhost:4173/](http://localhost:4173/)

### Pages

* `/` → DarcOS landing page
* `/about` → About DarcOS and our mission
* `/features` → Detailed feature specifications
* `/documentation` → Technical documentation
* `/download` → Download links and installation guides
* `/demo` → Interactive canvas demo
* `/api-test` → API testing interface

---

## 🚀 Get Involved

* Explore the **Canvas Demo** to see DarcOS in action
* Contribute to the project: open issues or submit PRs
* Join the community: help shape the future of deterministic computing

---

## 📚 Resources

* [WLP4 Specification](https://student.cs.uwaterloo.ca/~cs241/wlp4/)
* [WLP4 Tutorial](https://student.cs.uwaterloo.ca/~cs241/wlp4/WLP4tutorial.html)

---

## ❤️ Philosophy

We believe an OS should be **transparent in cost**, **consistent in behavior**, and **approachable to reason about**. DarcOS prioritizes explicit control and verifiability over opaque magic.

---

