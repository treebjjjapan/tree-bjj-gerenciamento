
import React from 'react';
import { 
  Search, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { useAppContext } from '../AppContext';

const Store: React.FC = () => {
  const { products } = useAppContext();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar Kimonos, Faixas..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
          />
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-slate-900/10">
          Vender Produto
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="relative mb-4">
              <img src={product.imageUrl} alt={product.name} className="w-full aspect-square object-cover rounded-2xl" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category}</p>
              <h3 className="font-bold text-slate-800 text-sm mt-1 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2 h-10">{product.name}</h3>
              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-black text-slate-900">¥ {product.price.toLocaleString('ja-JP')}</span>
                <button className="p-2 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg">
                  <Plus size={18} />
                </button>
              </div>
              <div className="mt-3">
                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{width: `${(product.stock / 50) * 100}%`}}></div>
                 </div>
                 <span className="text-[9px] font-bold text-slate-400 mt-1 block">Estoque: {product.stock} un.</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-black mb-2">Linha Exclusiva Tree BJJ Japan</h3>
            <p className="text-slate-400 max-w-md">Equipamentos de alta performance para o mercado japonês.</p>
          </div>
          <button className="px-8 py-4 bg-emerald-500 rounded-2xl font-black text-sm hover:bg-emerald-400 transition-all flex items-center space-x-2">
            <span>Ver Catálogo Completo</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Store;
