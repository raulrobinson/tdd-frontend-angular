import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TodoComponent } from './todo.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;

  beforeEach(() => {
    localStorage.clear(); // ⚠️ Limpiar antes de crear el componente

    TestBed.configureTestingModule({
      imports: [
        TodoComponent,
        NoopAnimationsModule // Evita animaciones del snackbar en tests
      ]
    });

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe agregar una nueva tarea', () => {
    component.newTask = 'Comprar pan';
    component.addTask();
    expect(component.tasks.length).toBe(1);
    expect(component.tasks[0].text).toBe('Comprar pan');
  });

  it('no debe agregar una tarea vacía', () => {
    component.newTask = '   ';
    component.addTask();
    expect(component.tasks.length).toBe(0);
  });

  it('debe marcar una tarea como completada', () => {
    component.newTask = 'Leer';
    component.addTask();
    component.completeTask(0);
    expect(component.tasks[0].completed).toBeTrue();
  });

  it('debe desbloquear una tarea completada', () => {
    component.newTask = 'Estudiar';
    component.addTask();
    component.completeTask(0);
    component.unlockTask(0);
    expect(component.tasks[0].completed).toBeFalse();
  });

  it('debe eliminar una tarea', () => {
    component.newTask = 'Limpiar';
    component.addTask();
    component.removeTask(0);
    expect(component.tasks.length).toBe(0);
  });

  it('debe actualizar el texto de la tarea', () => {
    component.newTask = 'Viejo texto';
    component.addTask();
    const tarea = component.tasks[0];
    component.saveEdit(tarea, 'Nuevo texto');
    expect(component.tasks[0].text).toBe('Nuevo texto');
  });

  it('debe mantener el texto original si se intenta guardar vacío', () => {
    component.newTask = 'Original';
    component.addTask();
    const tarea = component.tasks[0];
    component.saveEdit(tarea, '');
    expect(component.tasks[0].text).toBe('Original');
  });

  it('debe filtrar tareas completadas', () => {
    component.tasks = [
      { text: 'Tarea 1', completed: true },
      { text: 'Tarea 2', completed: false }
    ];
    component.filter = 'completed';
    expect(component.filteredTasks().length).toBe(1);
    expect(component.filteredTasks()[0].text).toBe('Tarea 1');
  });

  it('debe filtrar tareas pendientes', () => {
    component.tasks = [
      { text: 'Tarea 1', completed: true },
      { text: 'Tarea 2', completed: false }
    ];
    component.filter = 'pending';
    expect(component.filteredTasks().length).toBe(1);
    expect(component.filteredTasks()[0].text).toBe('Tarea 2');
  });

  it('debe mostrar todas las tareas con filtro "all"', () => {
    component.tasks = [
      { text: 'A', completed: true },
      { text: 'B', completed: false }
    ];
    component.filter = 'all';
    expect(component.filteredTasks().length).toBe(2);
  });
});
