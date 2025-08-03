
'use client';

import { useEffect, useRef, useState, type FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Barcode } from 'lucide-react';

interface BarcodeScannerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

const BarcodeScannerDialog: FC<BarcodeScannerDialogProps> = ({ isOpen, onClose, onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let barcodeDetector: any; // Use 'any' to avoid TS errors for experimental API

    const startScan = async () => {
      if (!isOpen || !('BarcodeDetector' in window)) {
        if (isOpen) {
           toast({
            variant: 'destructive',
            title: 'Barcode Scanner Not Supported',
            description: 'Seu navegador não suporta a detecção de código de barras.',
          });
        }
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        // @ts-ignore
        barcodeDetector = new window.BarcodeDetector({ formats: ['ean_13', 'upc_a', 'code_128', 'qr_code'] });

        const detectBarcode = async () => {
          if (!isScanning || !barcodeDetector || !videoRef.current || videoRef.current.readyState < 2) {
            requestAnimationFrame(detectBarcode);
            return;
          }

          try {
            const barcodes = await barcodeDetector.detect(videoRef.current);
            if (barcodes.length > 0) {
              setIsScanning(false);
              onScan(barcodes[0].rawValue);
            }
          } catch (error) {
            console.error('Barcode detection failed:', error);
          }
          if (isScanning) {
            requestAnimationFrame(detectBarcode);
          }
        };

        detectBarcode();

      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Acesso à câmera negado',
          description: 'Por favor, habilite as permissões da câmera nas configurações do seu navegador.',
        });
      }
    };
    
    if (isOpen) {
      setIsScanning(true);
      startScan();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setIsScanning(false);
    };
  }, [isOpen, onScan, toast, isScanning]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Escanear Código de Barras</DialogTitle>
          <DialogDescription>
            Aponte a câmera para o código de barras do produto.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <video ref={videoRef} className="w-full aspect-video rounded-md bg-black" autoPlay muted playsInline />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-3/4 h-1/2 border-4 border-dashed border-primary/70 rounded-lg" />
          </div>
        </div>
        {hasCameraPermission === false && (
          <Alert variant="destructive">
            <Barcode className="h-4 w-4" />
            <AlertTitle>Acesso à Câmera Necessário</AlertTitle>
            <AlertDescription>
              Por favor, permita o acesso à câmera para usar esta funcionalidade.
            </AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScannerDialog;
