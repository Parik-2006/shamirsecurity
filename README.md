# 🛡️ ShamirSecurity: Multi-Part Cryptographic Sharding

> **A High-Entropy Threshold Cryptography Engine.**
> *Built for Distributed Key Management, Secure Multiparty Computation, and Data Resilience.*

---

## 📖 Project Objective

In modern cybersecurity, the "Single Point of Failure" is the greatest risk to sensitive data. If a master key is stolen, the entire system is compromised. Traditional encryption often relies on a single entity holding the "keys to the kingdom."

**The Solution:**
This project implements **Shamir's Secret Sharing (SSS)**. It allows a secret (like a password or a private key) to be divided into $N$ unique parts (shares). The original secret can only be reconstructed when a minimum threshold $T$ of shares are combined.

* **Fault Tolerance:** Losing a few shares doesn't lose the data.
* **Information-Theoretic Security:** An attacker with $T-1$ shares has zero knowledge of the secret.
* **Mathematical Integrity:** Based on polynomial interpolation over Finite Fields.

---

## ⚙️ The Core Technologies

The engine secures data through three sophisticated layers of algebraic cryptography:

### **1. Polynomial Generation (The Anchor)**

The system treats the secret as the constant term ($a_0$) of a random polynomial of degree $T-1$.


$$f(x) = S + a_1x + a_2x^2 + \dots + a_{T-1}x^{T-1}$$


By generating random coefficients for $a_1 \dots a_{T-1}$, the system ensures that the secret is hidden within a unique mathematical function.

### **2. Finite Field Arithmetic (Galois Fields)**

To prevent "approximation attacks" and ensure precision with large numbers, the system operates within a **Finite Field (GF($P$))**.

* **The Theory:** All calculations are performed modulo a large Prime number.
* **The Benefit:** This ensures that coordinates remain integers and that the secret space is uniformly distributed, making brute-force attacks mathematically impossible.

### **3. Lagrange Interpolation (The Reconstructor)**

To recover the secret, the engine utilizes the **Lagrange Basis Polynomial**.

* **The Process:** Given $T$ points $(x, y)$, the system reconstructs the original polynomial to find the $y$-intercept ($x=0$).
* **Complexity:** This allows for $O(T^2)$ reconstruction time, providing near-instant access for authorized users while remaining impenetrable to others.

---

## 🌍 Real-World Scenarios

This project simulates secret management across critical security use cases:

| Scenario | The Challenge | The Solution |
| --- | --- | --- |
| **🔑 Digital Vaults** | Protecting a Master Root Key. | **Threshold Logic:** Distribute 3 shares; require any 2 to open the vault. |
| **🛰️ Nuclear/Military** | Preventing unauthorized launch. | **Multi-Sig Auth:** Multiple officers must provide their shares simultaneously. |
| **☁️ Cloud Sharding** | Storing keys across different nodes. | **Distributed Storage:** Even if one node is breached, the secret is safe. |
| **🧬 Inheritance** | Passing digital assets to heirs. | **Partial Disclosure:** Heirs receive shares that only work when combined. |

---

## 🛠️ Tech Stack

* **Runtime Environment:** Node.js
* **Backend Framework:** Express.js
* **Cryptographic Logic:** JavaScript (Implementation of SSS & Lagrange Interpolation)
* **Frontend:** EJS (Embedded JavaScript Templates), CSS (Cyberpunk Dark Mode)
* **Data Flow:** JSON-based Secret Sharding and Reconstruction

---

## ☁️ Deployment

This project is optimized for cloud-native environments and web-based interaction.

* The Node.js backend handles the polynomial math and coordinate generation.
* The Express server manages the interactive simulation of splitting and joining secrets.
* **Live Link:** https://shamirsecurity-1-aclh.onrender.com


---

### 👨‍🏫 Acknowledgments

This project was developed as part of the **Data Structures and Applications (DSA-EL)** curriculum at **R V College of Engineering**. Special thanks to:

* **Department of Computer Science**, RVCE.
* Inspired by the cryptographic research of **Adi Shamir**.

---

### 📄 License

Educational Research Purpose - RVCE CSE 2025.

---

### 🤝 Contributing & Issues

This project is open for viewing. **Direct changes are restricted.**

* **Found a bug?** Please [Open a New Issue](https://www.google.com/search?q=https://github.com/Parik-2006/shamirsecurity/issues) and describe the problem.
* **Want to fix it?** Please Fork the repo and submit a Pull Request (PR) for review.

