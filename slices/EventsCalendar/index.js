"use client"

import { useState } from "react";
import { FadeIn } from "@/components/FadeIn";
import { PrismicRichText } from "@prismicio/react";

/**
 * @typedef {import("@prismicio/client").Content.EventsCalendarSlice} EventsCalendarSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<EventsCalendarSlice>} EventsCalendarProps
 * @type {import("react").FC<EventsCalendarProps>}
 */
const EventsCalendar = ({ slice }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDay = (day) => {
    if (!day) return [];
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateToCheck = new Date(year, month, day);
    
    return slice.primary.events.filter(event => {
      const eventDate = new Date(event.eventdate);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const events = getEventsForDay(day);
    if (events.length > 0) {
      setSelectedDay(day);
      setSelectedEvents(events);
    }
  };

  const closeModal = () => {
    setSelectedDay(null);
    setSelectedEvents([]);
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const calendarDays = getCalendarDays();

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-12 px-4"
    >
      <FadeIn>
        <h2 className="font-bold-slanted mb-8 scroll-pt-6 text-6xl uppercase md:text-5xl text-center text-white text-pretty mt-4">
          {slice.primary.title}
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="text-center mb-8 text-white">
          <PrismicRichText field={slice.primary.description} />
        </div>
      </FadeIn>

      <FadeIn>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="bg-white/10 hover:bg-[#9e972d] hover:text-black text-white px-4 py-2 rounded-lg transition-colors"
            >
              ← Anterior
            </button>
            
            <h3 className="text-3xl font-bold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            
            <button
              onClick={nextMonth}
              className="bg-white/10 hover:bg-[#9e972d] hover:text-black text-white px-4 py-2 rounded-lg transition-colors"
            >
              Siguiente →
            </button>
          </div>

          <div className="bg-[#9e972d] p-4 backdrop-blur-sm">
            <div className="grid grid-cols-7 gap-2 mb-2 bg-black">
              {dayNames.map(day => (
                <div key={day} className="text-center font-semibold text-white/70 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="bg-[#9e972d] grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                const dayEvents = getEventsForDay(day);
                const hasEvents = dayEvents.length > 0;
                
                return (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={`
                      min-h-[120px] p-2 rounded-lg border transition-all
                      ${day ? 'bg-white/5 border-white/10' : 'bg-transparent border-transparent'}
                      ${hasEvents ? 'ring-2 ring-black cursor-pointer hover:bg-white/10' : ''}
                    `}
                  >
                    {day && (
                      <>
                        <div className="text-white font-semibold mb-2">{day}</div>
                        
                        {dayEvents.map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            className="bg-black rounded p-2 mb-2 text-xs text-black hover:scale-105 transition-transform cursor-pointer"
                          >
                            <div className="font-bold text-white truncate">
                              {event.eventtitle}
                            </div>
                            <div className="text-white/80 text-[10px] mt-1">
                              {event.eventtype}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {selectedDay && selectedEvents.length > 0 && (
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={closeModal}
            >
              <div 
                className="bg-[#9e972d] rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border-2 border-black shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-3xl font-bold text-black">
                    {selectedDay} de {monthNames[currentDate.getMonth()]}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-black hover:text-white text-4xl leading-none font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedEvents.map((event, index) => {
                    const eventDate = new Date(event.eventdate);
                    return (
                      <div
                        key={index}
                        className="bg-black rounded-xl p-6 border border-white/10"
                      >
                        <h4 className="text-2xl font-bold text-white mb-3">
                          {event.eventtitle}
                        </h4>
                        <div className="text-white/90 mb-3">
                          <PrismicRichText field={event.eventdescription} />
                        </div>
                        <div className="text-sm text-[#9e972d] italic font-semibold">
                          {event.eventtype}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {slice.primary.events.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Todos los Eventos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slice.primary.events.map((event, index) => {
                  const eventDate = new Date(event.eventdate);
                  return (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-colors border border-white/20"
                    >
                      <div className="text-sm text-black mb-2">
                        {eventDate.toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <h4 className="text-xl font-bold text-white mb-3">
                        {event.eventtitle}
                      </h4>
                      <div className="text-black mb-3">
                        <PrismicRichText field={event.eventdescription} />
                      </div>
                      <div className="text-sm text-white/60 italic">
                        {event.eventtype}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </FadeIn>
    </section>
  );
};

export default EventsCalendar;