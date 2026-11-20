/* 캐릭터 그림 로딩 실패 시에도 의미를 잃지 않도록 쓰는 비인물 기호입니다. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dest=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../media/symbols');fs.mkdirSync(dest,{recursive:true});
const shapes={
 help:'<path d="M70 159v-56q0-15 10-15t10 15V58q0-15 10-15t10 15v42-52q0-15 10-15t10 15v52-39q0-15 10-15t10 15v58l14-24q9-11 19-1t0 22l-31 53q-8 18-33 18H93q-15 0-23-17Z"/>',
 hurt:'<path d="m58 115 57-57q13-13 26 0l36 36q13 13 0 26l-57 57q-13 13-26 0l-36-36q-13-13 0-26Z"/><path d="m97 86 53 53m-70-36 53 53M120 103v30m-15-15h30"/>',
 scared:'<circle cx="120" cy="112" r="66"/><circle cx="96" cy="101" r="6" fill="#1d3955"/><circle cx="144" cy="101" r="6" fill="#1d3955"/><ellipse cx="120" cy="143" rx="13" ry="17"/><path d="m61 42-11-14m129 14 11-14"/>',
 rest:'<path d="M49 173h144M60 173v-83h23v57h100v26M83 119h92q10 0 10 20v8M166 54h27l-27 29h27"/>',
 toilet:'<path d="M52 53h135v129H52Z"/><circle cx="88" cy="88" r="9"/><path d="M88 105v44m-15-35h30m-27 49h24M137 105v42m-15-34h30m-31 50h32"/><circle cx="137" cy="88" r="9"/><path d="m137 115-17 33h34Z"/>',
 water:'<path d="M120 37q-55 63-55 94a55 55 0 0 0 110 0q0-31-55-94Z"/><path d="M88 131q0 29 28 32"/>',
 teacher:'<rect x="40" y="45" width="160" height="115" rx="10"/><path d="M80 195v-35m80 35v-35M78 80h83M78 109h53"/><circle cx="166" cy="144" r="20"/><path d="M135 197q3-31 31-31t31 31"/>',
 together:'<circle cx="77" cy="75" r="24"/><circle cx="163" cy="75" r="24"/><path d="M42 168v-31q0-29 35-29t35 29v31m16 0v-31q0-29 35-29t35 29v31M83 142l37 22 37-22"/>',
 stop:'<path d="m81 42 78 0 43 43v70l-43 43H81l-43-43V85Z"/><path d="M74 120h92" stroke-width="16"/>',
 slow:'<path d="M45 143q0-48 61-48 39 0 48 34h35v27H45Z"/><circle cx="176" cy="103" r="20"/><path d="M68 156v24m50-24v24m-63-97H28m45-22H45"/>',
 lost:'<path d="m36 69 55-17 58 17 55-17v127l-55 17-58-17-55 17Z"/><path d="M91 52v127m58-110v127M106 97q0-17 16-17 20 0 20 17 0 12-20 17v15"/><circle cx="122" cy="146" r="4" fill="#1d3955"/>',
 here:'<path d="M120 198q-62-73-62-112a62 62 0 0 1 124 0q0 39-62 112Z"/><circle cx="120" cy="84" r="24"/>',
 again:'<path d="M174 73a73 73 0 1 0 15 75M174 35v43h-43"/>',
 unknown:'<path d="M82 82q0-37 38-37 43 0 43 35 0 27-43 38v28"/><circle cx="120" cy="178" r="7" fill="#1d3955"/>',
 wait:'<circle cx="120" cy="120" r="79"/><path d="M120 66v58l40 24"/>',
 yes:'<circle cx="120" cy="120" r="78"/><path d="m75 121 30 31 62-64" stroke-width="14"/>',
 no:'<circle cx="120" cy="120" r="78"/><path d="m85 85 70 70m0-70-70 70" stroke-width="14"/>',
 okay:'<circle cx="120" cy="120" r="78"/><circle cx="92" cy="105" r="5" fill="#1d3955"/><circle cx="148" cy="105" r="5" fill="#1d3955"/><path d="M80 139q40 42 80 0"/>',
 exit:'<rect x="52" y="42" width="132" height="156" rx="9"/><path d="M75 120h104m-36-35 36 35-36 35"/>',
 fire:'<path d="M125 30q13 49-15 70 0-30-19-38-2 30-27 57-36 63 43 83 85 10 71-72-9-28-25-41 0 36-20 38 13-53-8-97Z"/>',
 bag:'<rect x="49" y="78" width="142" height="117" rx="17"/><path d="M86 78V58q0-26 34-26t34 26v20M80 109v33m80-33v33"/>',
 seatbelt:'<path d="M64 41v145q0 16 16 16h101M63 121h91v65M66 61l114 122" stroke-width="13"/><rect x="111" y="109" width="30" height="22" rx="4" fill="#fff4de"/>',
 sit:'<circle cx="116" cy="55" r="22"/><path d="M111 86v48h57v58M75 89v71h76m-76 0v36m76-36v36" stroke-width="14"/>'
};
for(const [name,body]of Object.entries(shapes)){const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" rx="32" fill="#fff4de"/><g stroke="#1d3955" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;fs.writeFileSync(path.join(dest,name+'.svg'),svg);}
console.log(`${Object.keys(shapes).length}개 의미 기호를 만들었습니다.`);
