
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import type { Product } from '@/types';

// Helper function to convert Firestore doc to Product
const toProduct = (doc: QueryDocumentSnapshot | DocumentData): Product => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
    } as Product;
};

export async function getProducts(): Promise<Product[]> {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = querySnapshot.docs.map(toProduct);
        return products;
    } catch (error) {
        console.error("Error fetching products: ", error);
        return [];
    }
}

export async function getProduct(id: string): Promise<Product | null> {
    try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return toProduct(docSnap);
        }
        return null;
    } catch (error) {
        console.error("Error fetching product: ", error);
        return null;
    }
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product | null> {
    try {
        const docRef = await addDoc(collection(db, "products"), productData);
        return {
            id: docRef.id,
            ...productData,
        }
    } catch (error) {
        console.error("Error adding product: ", error);
        return null;
    }
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<void> {
    try {
        const docRef = doc(db, "products", id);
        await updateDoc(docRef, productData);
    } catch (error) {
        console.error("Error updating product: ", error);
    }
}
