
import { Component, OnDestroy, OnInit } from '@angular/core';

interface Calle {
  nombre: string;
  distancia: number;
  trafico: boolean;
  luz: 'ROJO' | 'AMARILLO' | 'VERDE';
}

interface Evento {
  hora: string;
  mensaje: string;
  tipo: 'trafico' | 'semaforo' | 'sistema';
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  sistemaActivo = true;
  simulacionActiva = true;

  totalDetecciones = 0;
  totalCambios = 0;

  calleA: Calle = {
    nombre: 'Calle A',
    distancia: 12.5,
    trafico: true,
    luz: 'VERDE'
  };

  calleB: Calle = {
    nombre: 'Calle B',
    distancia: 45.2,
    trafico: false,
    luz: 'ROJO'
  };

  eventos: Evento[] = [
    {
      hora: this.obtenerHora(),
      mensaje: 'Sistema de demostración iniciado.',
      tipo: 'sistema'
    }
  ];

  private simulationTimer?: ReturnType<typeof setInterval>;
  private turnoA = true;

  ngOnInit(): void {
    this.iniciarSimulacion();
  }

  ngOnDestroy(): void {
    this.detenerTemporizador();
  }

  private obtenerHora(): string {
    return new Date().toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  private registrarEvento(
    mensaje: string,
    tipo: Evento['tipo']
  ): void {
    this.eventos.unshift({
      hora: this.obtenerHora(),
      mensaje,
      tipo
    });

    // Conservamos los últimos 20 eventos.
    this.eventos = this.eventos.slice(0, 20);
  }

  iniciarSimulacion(): void {
    this.detenerTemporizador();
    this.simulacionActiva = true;

    this.registrarEvento(
      'Simulación automática activada.',
      'sistema'
    );

    this.simulationTimer = setInterval(() => {
      if (this.sistemaActivo && this.simulacionActiva) {
        this.actualizarDatos();
      }
    }, 3000);
  }

  detenerTemporizador(): void {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
      this.simulationTimer = undefined;
    }
  }

  alternarSimulacion(): void {
    if (this.simulacionActiva) {
      this.simulacionActiva = false;
      this.detenerTemporizador();
      this.registrarEvento(
        'Simulación automática pausada.',
        'sistema'
      );
    } else {
      this.iniciarSimulacion();
    }
  }

  alternarSistema(): void {
    this.sistemaActivo = !this.sistemaActivo;

    this.registrarEvento(
      this.sistemaActivo
        ? 'Panel de demostración activado.'
        : 'Panel de demostración pausado.',
      'sistema'
    );
  }

  private actualizarDatos(): void {
    const traficoAnteriorA = this.calleA.trafico;
    const traficoAnteriorB = this.calleB.trafico;
    const luzAnteriorA = this.calleA.luz;
    const luzAnteriorB = this.calleB.luz;

    // Distancias ficticias para probar la interfaz.
    this.calleA.distancia = this.generarDistancia();
    this.calleB.distancia = this.generarDistancia();

    this.calleA.trafico = this.calleA.distancia <= 20;
    this.calleB.trafico = this.calleB.distancia <= 20;

    if (this.calleA.trafico && !traficoAnteriorA) {
      this.totalDetecciones++;
      this.registrarEvento(
        'Tráfico detectado en Calle A.',
        'trafico'
      );
    }

    if (this.calleB.trafico && !traficoAnteriorB) {
      this.totalDetecciones++;
      this.registrarEvento(
        'Tráfico detectado en Calle B.',
        'trafico'
      );
    }

    // Alternamos las luces para representar el funcionamiento.
    this.turnoA = !this.turnoA;

    if (this.calleA.trafico && !this.calleB.trafico) {
      this.turnoA = true;
    } else if (this.calleB.trafico && !this.calleA.trafico) {
      this.turnoA = false;
    }

    this.calleA.luz = this.turnoA ? 'VERDE' : 'ROJO';
    this.calleB.luz = this.turnoA ? 'ROJO' : 'VERDE';

    if (
      this.calleA.luz !== luzAnteriorA ||
      this.calleB.luz !== luzAnteriorB
    ) {
      this.totalCambios++;
      this.registrarEvento(
        `Cambio de luces: A ${this.calleA.luz}, B ${this.calleB.luz}.`,
        'semaforo'
      );
    }

    if (
      !this.calleA.trafico &&
      !this.calleB.trafico &&
      (traficoAnteriorA || traficoAnteriorB)
    ) {
      this.registrarEvento(
        'No se detecta tráfico en ninguna calle.',
        'trafico'
      );
    }
  }

  private generarDistancia(): number {
    return Number((5 + Math.random() * 50).toFixed(1));
  }

  simularTrafico(): void {
    this.calleA.distancia = this.calleA.trafico ? 35 : 10;
    this.calleA.trafico = !this.calleA.trafico;

    if (this.calleA.trafico) {
      this.totalDetecciones++;
      this.registrarEvento(
        'Detección manual simulada en Calle A.',
        'trafico'
      );
    } else {
      this.registrarEvento(
        'Detección simulada finalizada en Calle A.',
        'trafico'
      );
    }
  }

  limpiarHistorial(): void {
    this.eventos = [];
    this.registrarEvento(
      'Historial de eventos reiniciado.',
      'sistema'
    );
  }
}


