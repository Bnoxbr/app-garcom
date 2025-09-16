// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loading } from "@/components/Loading";

const ClientProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("informacoes");
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [restaurantInfo, setRestaurantInfo] = useState<any>({});
  const [photos, setPhotos] = useState<any[]>([]);
  const [hiringHistory, setHiringHistory] = useState<any[]>([]);

  // Add states for editable fields
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else if (profile) {
          setRestaurantInfo(profile);
          setName(profile.name || "");
          setAddress(profile.address || "");
          setPhone(profile.phone || "");
          setEmail(profile.email || "");
          setDescription(profile.description || "");

          // Fetch photos
          const { data: photosData, error: photosError } = await supabase
            .from('photos')
            .select('photo_url')
            .eq('user_id', user.id);

          if (photosError) {
            console.error('Error fetching photos:', photosError);
          } else {
            setPhotos(photosData.map(p => p.photo_url));
          }

          // Fetch hiring history
          const { data: historyData, error: historyError } = await supabase
            .from('hiring_history')
            .select('*')
            .eq('restaurant_id', user.id);

          if (historyError) {
            console.error('Error fetching hiring history:', historyError);
          } else {
            setHiringHistory(historyData);
          }
        }
      }
      setLoading(false);
    };

    fetchProfileData();
  }, []);

  const handleSaveChanges = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { error } = await supabase
            .from('profiles')
            .update({
                name: name,
                address: address,
                phone: phone,
                email: email,
                description: description,
            })
            .eq('id', user.id);

        if (error) {
            console.error('Error updating profile:', error);
        } else {
            setRestaurantInfo({ ...restaurantInfo, name, address, phone, email, description });
            setIsEditMode(false);
        }
    }
  };

  const toggleEditMode = () => {
    if (isEditMode) {
        handleSaveChanges();
    } else {
        setIsEditMode(true);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800 pb-16">
      {/* Nav Bar */}
      <div className="fixed top-0 w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <a
              href="https://readdy.ai/home/2306f3cf-5149-440e-ad37-bcddea6fa55c/fdcee889-a23c-4468-b01c-7af64b96c87c"
              data-readdy="true"
              className="cursor-pointer"
            >
              <i className="fas fa-arrow-left text-xl mr-3"></i>
            </a>
            <h1 className="text-xl font-bold">Perfil</h1>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-gray-800 cursor-pointer">
              <i className="fas fa-cog text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-16 px-0">
        {/* Cover Image and Profile */}
        <div className="relative">
          <div className="h-40 w-full overflow-hidden">
            <img
              src={restaurantInfo.cover_image_url || "https://readdy.ai/api/search-image?query=Restaurant%20storefront%20with%20elegant%20facade%2C%20outdoor%20seating%20area%2C%20warm%20lighting%2C%20sophisticated%20exterior%2C%20neutral%20color%20palette%2C%20professional%20architectural%20photography%2C%20no%20people%2C%20wide%20angle%20view%2C%20high-end%20dining%20establishment%2C%20evening%20atmosphere&width=375&height=150&seq=22&orientation=landscape"}
              alt="Capa do restaurante"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="absolute -bottom-16 left-4 border-4 border-white rounded-full overflow-hidden shadow-lg">
            <img
              src={restaurantInfo.profile_image_url || "https://readdy.ai/api/search-image?query=Restaurant%20logo%20design%20with%20elegant%20typography%2C%20minimalist%20icon%20of%20fork%20and%20knife%2C%20sophisticated%20color%20palette%2C%20professional%20branding%2C%20clean%20background%2C%20high%20quality%20vector%20style%2C%20restaurant%20identity%20design&width=100&height=100&seq=23&orientation=squarish"}
              alt="Logo do restaurante"
              className="w-24 h-24 object-cover"
            />
          </div>
        </div>

        {/* Restaurant Name and Edit Button */}
        <div className="mt-20 px-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{isEditMode ? <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" /> : restaurantInfo.name}</h2>
          <button
            onClick={toggleEditMode}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg !rounded-button shadow-sm flex items-center cursor-pointer"
          >
            <i
              className={`fas ${isEditMode ? "fa-check" : "fa-edit"} mr-2`}
            ></i>
            <span>{isEditMode ? "Salvar" : "Editar Perfil"}</span>
          </button>
        </div>



        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <div className="flex px-4">
            <button
              className={`py-3 px-4 font-medium text-sm border-b-2 ${activeTab === "informacoes" ? "border-gray-800 text-gray-800" : "border-transparent text-gray-500"}`}
              onClick={() => setActiveTab("informacoes")}
            >
              Informações
            </button>
            <button
              className={`py-3 px-4 font-medium text-sm border-b-2 ${activeTab === "fotos" ? "border-gray-800 text-gray-800" : "border-transparent text-gray-500"}`}
              onClick={() => setActiveTab("fotos")}
            >
              Fotos
            </button>
            <button
              className={`py-3 px-4 font-medium text-sm border-b-2 ${activeTab === "gestao" ? "border-gray-800 text-gray-800" : "border-transparent text-gray-500"}`}
              onClick={() => setActiveTab("gestao")}
            >
              Gestão
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-4">
          {/* Informações Tab */}
          {activeTab === "informacoes" && (
            <div className="space-y-6">
              {/* Descrição */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">Descrição</h3>
                  {isEditMode && (
                    <button className="text-gray-500 cursor-pointer">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  )}
                </div>
                {isEditMode ? (
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                ) : (
                  <p className="text-gray-600 text-sm">
                    {restaurantInfo.description}
                  </p>
                )}
              </div>

              {/* Endereço */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">Endereço</h3>
                  {isEditMode && (
                    <button className="text-gray-500 cursor-pointer">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  )}
                </div>
                {isEditMode ? (
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                ) : (
                  <p className="text-gray-600 text-sm">
                    {restaurantInfo.address}
                  </p>
                )}
              </div>

              {/* Contato */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">Contato</h3>
                  {isEditMode && (
                    <button className="text-gray-500 cursor-pointer">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  {isEditMode ? (
                    <>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg mb-2"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <input
                        type="email"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600">
                        <i className="fas fa-phone-alt mr-2"></i>
                        {restaurantInfo.phone}
                      </p>
                      <p className="text-gray-600">
                        <i className="fas fa-envelope mr-2"></i>
                        {restaurantInfo.email}
                      </p>
                    </>
                  )}
                </div>
              </div>


            </div>
          )}

          {/* Fotos Tab */}
          {activeTab === "fotos" && (
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-28 object-cover rounded-lg"
                  />
                  {isEditMode && (
                    <button className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer">
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  )}
                </div>
              ))}
              {isEditMode && (
                <div className="w-full h-28 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer">
                  <i className="fas fa-plus text-gray-500 text-2xl"></i>
                </div>
              )}
            </div>
          )}

          {/* Gestão Tab */}
          {activeTab === "gestao" && (
            <div className="space-y-6">
              {/* Histórico de Contratações */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-lg mb-3">
                  Histórico de Contratações
                </h3>
                <div className="space-y-4">
                  {hiringHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.position}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-medium ${
                            item.status === "Finalizado"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {item.status}
                        </p>
                        <p className="text-xs text-gray-400">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avaliações */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-lg mb-3">Avaliações</h3>
                <div className="flex items-center mb-2">
                  <span className="text-3xl font-bold mr-2">4.8</span>
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    (125 avaliações)
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="w-12">5 estrelas</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mx-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                    <span>85%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-12">4 estrelas</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mx-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                    <span>10%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-12">3 estrelas</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mx-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: "3%" }}
                      ></div>
                    </div>
                    <span>3%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-12">2 estrelas</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mx-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: "1%" }}
                      ></div>
                    </div>
                    <span>1%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-12">1 estrela</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mx-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: "1%" }}
                      ></div>
                    </div>
                    <span>1%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav Bar */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-2">
        <a
          href="https://readdy.ai/home/2306f3cf-5149-440e-ad37-bcddea6fa55c/fdcee889-a23c-4468-b01c-7af64b96c87c"
          data-readdy="true"
          className="text-center text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          <i className="fas fa-home text-xl"></i>
          <span className="block text-xs">Início</span>
        </a>
        <a
          href="https://readdy.ai/home/2306f3cf-5149-440e-ad37-bcddea6fa55c/fdcee889-a23c-4468-b01c-7af64b96c87c"
          data-readdy="true"
          className="text-center text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          <i className="fas fa-concierge-bell text-xl"></i>
          <span className="block text-xs">Serviços</span>
        </a>
        <a
          href="https://readdy.ai/home/2306f3cf-5149-440e-ad37-bcddea6fa55c/fdcee889-a23c-4468-b01c-7af64b96c87c"
          data-readdy="true"
          className="text-center text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          <i className="fas fa-calendar-alt text-xl"></i>
          <span className="block text-xs">Agenda</span>
        </a>
        <a
          href="https://readdy.ai/home/2306f3cf-5149-440e-ad37-bcddea6fa55c/fdcee889-a23c-4468-b01c-7af64b96c87c"
          data-readdy="true"
          className="text-center text-gray-800 font-bold cursor-pointer"
        >
          <i className="fas fa-user-circle text-xl"></i>
          <span className="block text-xs">Perfil</span>
        </a>
      </div>
    </div>
  );
};

export default ClientProfile;