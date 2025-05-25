import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private readonly SERVER_URL = 'http://localhost:3000';

  constructor() {
    this.socket = io(this.SERVER_URL, {
      withCredentials: true,
    });
  }

  joinEnchere(enchereId: number) {
    this.socket.emit('joinEnchere', enchereId);
  }

  envoyerMise(data: { enchere_id: number; utilisateur_id: number; montant: number }) {
    this.socket.emit('nouvelleMise', data);
  }

  onMiseUpdate(callback: (data: any) => void) {
    this.socket.on('miseUpdate', callback);
  }

  onMiseError(callback: (data: any) => void) {
    this.socket.on('miseError', callback);
  }

  onEnchereTerminee(callback: (data: any) => void) {
    this.socket.on('enchereTerminee', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
   onNouvelleEnchere(callback: (data: any) => void) {
    this.socket.on('nouvelleEnchere', callback);
  }

  onEnchereUpdated(callback: (data: any) => void) {
    this.socket.on('enchereUpdated', callback);
  }

  onTopMiseChanged(callback: (data: any) => void) {
    this.socket.on('topMiseChanged', callback);
  }

  leaveEnchere(enchereId: number) {
    this.socket.emit('leaveEnchere', enchereId);
  }

}
